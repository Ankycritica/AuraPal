import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import * as db from './db/mockDb.js'
import { generateGuestIdentity } from './utils/generateGuestIdentity.js'
import googleAuth from './auth/google.js'
import appleAuth from './auth/apple.js'
import sessionMiddleware from './auth/session.js'

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

const app = express()
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://aurapal.vercel.app", "https://aurapal.org"],
  methods: ["GET", "POST"],
  credentials: true
}))
app.use(express.json())
app.use(sessionMiddleware)

// Auth routes
app.use('/api/auth/google', googleAuth)
app.use('/api/auth/apple', appleAuth)

app.get('/api/auth/me', (req, res) => {
  if (req.user) {
    res.json({ user: req.user })
  } else {
    res.status(401).json({ error: 'Not authenticated' })
  }
})

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy()
  res.clearCookie('session')
  res.json({ ok: true })
})

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "https://aurapal.vercel.app", "https://aurapal.org"],
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"]
  }
})

const waiting = []
const peers = new Map()
const meta = new Map()

io.on('connection', (socket) => {
  console.log('Server: socket connected', socket.id)

  socket.on('identify', (info) => {
    // optional: store clientId if provided by client
    if (info?.clientId) {
      const existing = meta.get(socket.id) || {}
      meta.set(socket.id, { ...existing, clientId: info.clientId })
    }
  })

  socket.on('find_random', (data) => {
    console.log('Server: Received find_random from', socket.id, data)
    meta.set(socket.id, { ...data, socketId: socket.id })
    if (!waiting.includes(socket.id)) waiting.push(socket.id)
    tryPair()
  })

  socket.on('skip_random', () => {
    const partnerId = peers.get(socket.id)
    if (partnerId) {
      unpair(socket.id, partnerId)
      if (!waiting.includes(socket.id)) waiting.push(socket.id)
      tryPair()
    }
  })

  socket.on('exit', () => {
    const partnerId = peers.get(socket.id)
    if (partnerId) unpair(socket.id, partnerId)
    const i = waiting.indexOf(socket.id)
    if (i >= 0) waiting.splice(i, 1)
    meta.delete(socket.id)
  })

  socket.on('chat_message', (payload) => {
    const partnerId = peers.get(socket.id)
    if (!partnerId) return
    const msg = { id: payload.id || `m_${Date.now()}`, text: payload.text, from: socket.id, timestamp: Date.now() }
    io.to(partnerId).emit('chat_message', msg)
    socket.emit('delivered', { messageId: msg.id })
  })

  socket.on('message_seen', ({ messageId }) => {
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
    const recipientSocket = findSocketByUserId(toId)
    if (recipientSocket) io.to(recipientSocket).emit('friend_request', { fromMeta })
  })

  socket.on('friend_response', ({ requestId, accept }) => {
    console.log(`Friend request ${requestId} ${accept ? 'accepted' : 'declined'}`)
  })

  socket.on('report_user', ({ userId, reason }) => {
    console.log(`User ${socket.id} reported ${userId} for: ${reason}`)
  })

  socket.on('block_user', ({ userId }) => {
    console.log(`User ${socket.id} blocked ${userId}`)
  })

  socket.on('disconnect', (reason) => {
    console.log('Server: socket disconnected', socket.id, reason)
    const partnerId = peers.get(socket.id)
    if (partnerId) unpair(socket.id, partnerId)
    const i = waiting.indexOf(socket.id)
    if (i >= 0) waiting.splice(i, 1)
    meta.delete(socket.id)
  })

  function tryPair() {
    waiting.sort((a, b) => {
      const aMeta = meta.get(a)
      const bMeta = meta.get(b)
      if (aMeta?.isPremium && !bMeta?.isPremium) return -1
      if (!aMeta?.isPremium && bMeta?.isPremium) return 1
      return 0
    })

    const available = [...waiting]
    while (available.length >= 2) {
      let a = available.shift()
      let b = null

      const aMeta = meta.get(a)
      if (!aMeta) continue

      for (let i = 0; i < available.length; i++) {
        const candidate = available[i]
        const cMeta = meta.get(candidate)
        if (!cMeta) continue

        let match = false
        if (aMeta.isPremium) {
          match = cMeta.gender === aMeta.preferredGender || aMeta.preferredGender === 'Any'
        } else {
          match = cMeta.gender === aMeta.preferredGender || aMeta.preferredGender === 'Any' || cMeta.preferredGender === 'Any'
        }

        if (match) {
          b = candidate
          available.splice(i, 1)
          break
        }
      }

      if (!b && !aMeta.isPremium) {
        b = available.shift()
      }

      if (b) {
        const bMeta = meta.get(b)
        peers.set(a, b)
        peers.set(b, a)
        io.to(a).emit('paired', { roomId: `room_${a}_${b}`, partner: bMeta })
        io.to(b).emit('paired', { roomId: `room_${a}_${b}`, partner: aMeta })
        const idxA = waiting.indexOf(a)
        if (idxA >= 0) waiting.splice(idxA, 1)
        const idxB = waiting.indexOf(b)
        if (idxB >= 0) waiting.splice(idxB, 1)
      }
    }
  }

  function unpair(a, b) {
    peers.delete(a)
    peers.delete(b)
    io.to(a).emit('unpaired')
    io.to(b).emit('unpaired')
  }

  function findSocketByUserId(userId) {
    for (const [sid, m] of meta.entries()) {
      if (m.clientId === userId) return sid
    }
    return null
  }
})

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`AuraPal server listening on http://localhost:${PORT}`)
})
