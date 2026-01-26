import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import * as db from './db/mockDb.js'
import { generateGuestIdentity } from './utils/generateGuestIdentity.js'

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.post('/api/auth/demo-login', (req, res) => {
  const id = `demo_${Date.now()}`
  const user = db.createUser({ id, name: `Demo User ${id.slice(-4)}`, avatar: '😎' })
  const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user })
})

app.get('/api/friends', (req, res) => {
  const auth = req.headers.authorization || ''
  const token = auth.replace('Bearer ', '')
  try {
    const { userId } = jwt.verify(token, JWT_SECRET)
    const friends = db.getFriends(userId)
    res.json({ friends })
  } catch (e) {
    res.status(401).json({ error: 'invalid_token' })
  }
})

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://aurapal.vercel.app", "https://aurapal.org"],
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"]
  }
});

io.engine.on("connection_error", (err) => {
  console.log("Socket CORS error:", err);
});

const waiting = []
const peers = new Map()
const meta = new Map()

io.on('connection', (socket) => {
  const auth = socket.handshake.auth || {}
  if (auth.identity) {
    const { id, name, avatarEmoji, country } = auth.identity
    meta.set(socket.id, { id, name, avatar: avatarEmoji, country })
    db.createUser({ id, name, avatar: avatarEmoji })
  } else if (auth.token) {
    try {
      const { userId } = jwt.verify(auth.token, JWT_SECRET)
      const user = db.getUser(userId) || db.createUser({ id: userId, name: `User ${userId}`, avatar: '🙂' })
      meta.set(socket.id, { id: user.id, name: user.name, avatar: user.avatar })
    } catch (e) {}
  } else {
    const g = generateGuestIdentity()
    db.createUser({ id: g.id, name: g.name, avatar: g.avatar })
    meta.set(socket.id, { id: g.id, name: g.name, avatar: g.avatar, country: g.country })
  }

  socket.on('find_random', ({ age, gender, country, guestName, preferredGender, isPremium }, cb) => {
    const existingMeta = meta.get(socket.id) || {}
    meta.set(socket.id, { ...existingMeta, age, gender, country, guestName, preferredGender, isPremium })
    if (!waiting.includes(socket.id)) waiting.push(socket.id)
    if (typeof cb === 'function') cb({ ok: true, queued: true, position: waiting.indexOf(socket.id) + 1 })
    tryPair()
  })

  socket.on('skip_random', () => {
    const p = peers.get(socket.id)
    if (p) unpair(socket.id, p)
    if (!waiting.includes(socket.id)) waiting.push(socket.id)
    tryPair()
  })

  socket.on('stop_random', () => {
    const p = peers.get(socket.id)
    if (p) unpair(socket.id, p)
    const i = waiting.indexOf(socket.id)
    if (i >= 0) waiting.splice(i, 1)
  })

  socket.on('chat_message', (payload, ack) => {
    const partnerId = peers.get(socket.id)
    if (!partnerId) {
      if (typeof ack === 'function') ack({ ok: false, reason: 'not_paired' })
      return
    }
    const senderMeta = meta.get(socket.id)
    const msg = { id: payload.id || `m_${Date.now()}`, text: payload.text, from: senderMeta?.id || 'unknown', timestamp: Date.now() }
    db.saveMessage(msg)
    io.to(partnerId).emit('chat_message', msg)
    if (typeof ack === 'function') ack({ ok: true, id: msg.id })
    socket.emit('delivered', { messageId: msg.id })
  })

  socket.on('message_read', ({ messageId }) => {
    const partnerId = peers.get(socket.id)
    if (partnerId) io.to(partnerId).emit('seen', { messageId })
  })

  socket.on('typing', () => {
    const partnerId = peers.get(socket.id)
    if (partnerId) io.to(partnerId).emit('typing')
  })
  socket.on('stop_typing', () => {
    const partnerId = peers.get(socket.id)
    if (partnerId) io.to(partnerId).emit('stop_typing')
  })

  socket.on('friend_request', ({ toId, fromMeta }) => {
    const fromMetaLocal = meta.get(socket.id)
    const req = db.createFriendRequest({ fromId: fromMetaLocal?.id, toId, fromMeta: fromMeta || fromMetaLocal })
    const recipientSocket = findSocketByUserId(toId)
    if (recipientSocket) io.to(recipientSocket).emit('friend_request', req)
  })

  socket.on('friend_response', ({ requestId, accept }) => {
    if (accept) {
      const req = db.acceptFriendRequest(requestId)
      if (req) {
        const aSocket = findSocketByUserId(req.fromId)
        const bSocket = findSocketByUserId(req.toId)
        if (aSocket) io.to(aSocket).emit('friend_added', { id: req.toId, name: db.getUser(req.toId)?.name })
        if (bSocket) io.to(bSocket).emit('friend_added', { id: req.fromId, name: db.getUser(req.fromId)?.name })
      }
    } else {
      const req = db.declineFriendRequest(requestId)
      if (req) {
        const aSocket = findSocketByUserId(req.fromId)
        if (aSocket) io.to(aSocket).emit('friend_declined', { id: req.toId })
      }
    }
  })

  socket.on('report_user', ({ reason }) => {
    const partnerId = peers.get(socket.id)
    if (partnerId) {
      io.to(partnerId).emit('report_user', { reason })
      socket.emit('reported', { ok: true })
      unpair(socket.id, partnerId)
    }
  })

  socket.on('block_user', () => {
    const partnerId = peers.get(socket.id)
    if (partnerId) {
      io.to(partnerId).emit('block_user')
      unpair(socket.id, partnerId)
    }
  })

  socket.on('disconnect', () => {
    const i = waiting.indexOf(socket.id)
    if (i >= 0) waiting.splice(i, 1)
    const partnerId = peers.get(socket.id)
    if (partnerId) unpair(socket.id, partnerId)
    meta.delete(socket.id)
    peers.delete(socket.id)
  })

  function tryPair() {
    while (waiting.length >= 2) {
      const a = waiting.shift()
      const b = waiting.shift()
      if (!a || !b) break
      peers.set(a, b)
      peers.set(b, a)
      const aMeta = meta.get(a) || { id: a }
      const bMeta = meta.get(b) || { id: b }
      io.to(a).emit('paired', {
        peerId: bMeta.id,
        peerMeta: { name: bMeta.name, avatarEmoji: bMeta.avatar, country: bMeta.country },
        age: bMeta.age,
        gender: bMeta.gender,
        country: bMeta.country,
        guestName: bMeta.guestName
      })
      io.to(b).emit('paired', {
        peerId: aMeta.id,
        peerMeta: { name: aMeta.name, avatarEmoji: aMeta.avatar, country: aMeta.country },
        age: aMeta.age,
        gender: aMeta.gender,
        country: aMeta.country,
        guestName: aMeta.guestName
      })
    }
  }

  function unpair(a, b) {
    peers.delete(a)
    peers.delete(b)
    try { io.to(a).emit('unpaired') } catch (e) {}
    try { io.to(b).emit('unpaired') } catch (e) {}
    const ia = waiting.indexOf(a); if (ia >= 0) waiting.splice(ia,1)
    const ib = waiting.indexOf(b); if (ib >= 0) waiting.splice(ib,1)
  }

  function findSocketByUserId(userId) {
    for (const [sid, m] of meta.entries()) {
      if (m?.id === userId) return sid
    }
    return null
  }
})

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`AuraPal server listening on http://localhost:${PORT}`)
})


