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
app.use(cors({ origin: true, credentials: true }))
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
const io = new Server(httpServer, { cors: { origin: true, credentials: true } })

const waiting = []
const peers = new Map()
const meta = new Map()

io.on('connection', (socket) => {
  socket.on('find_random', (data) => {
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
    // Handle response
  })

  socket.on('disconnect', () => {
    const partnerId = peers.get(socket.id)
    if (partnerId) unpair(socket.id, partnerId)
    const i = waiting.indexOf(socket.id)
    if (i >= 0) waiting.splice(i, 1)
    meta.delete(socket.id)
  })

  function tryPair() {
    while (waiting.length >= 2) {
      const a = waiting.shift()
      const b = waiting.shift()
      peers.set(a, b)
      peers.set(b, a)
      const aMeta = meta.get(a)
      const bMeta = meta.get(b)
      io.to(a).emit('paired', { roomId: `room_${a}_${b}`, partner: bMeta })
      io.to(b).emit('paired', { roomId: `room_${a}_${b}`, partner: aMeta })
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