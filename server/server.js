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
import client from 'prom-client'
import rateLimit from 'express-rate-limit'
import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label }
    },
  },
})

// TURN configuration for ICE routing
const turnConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    {
      urls: process.env.TURN_URL || 'turn:fake.turn.server:3478',
      username: process.env.TURN_USER || 'user',
      credential: process.env.TURN_PASSWORD || 'password'
    }
  ]
}

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
})

const collectDefaultMetrics = client.collectDefaultMetrics
collectDefaultMetrics({ prefix: 'aurapal_' })

const videoQueueLengthGauge = new client.Gauge({
  name: 'aurapal_video_queue_length',
  help: 'Current length of the video queue'
})
const videoWaitTimeHistogram = new client.Histogram({
  name: 'aurapal_video_wait_time_seconds',
  help: 'Wait time in queue for video chat',
  buckets: [1, 5, 15, 30, 60, 120]
})
const matchSuccessCounter = new client.Counter({
  name: 'aurapal_match_success_total',
  help: 'Total successful matches'
})
const disconnectCounter = new client.Counter({
  name: 'aurapal_disconnect_total',
  help: 'Total unexpected disconnects'
})

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
})

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

const app = express()
app.use(cors({
  origin: function (origin, callback) {
    // Allow any origin for maximum compatibility with the socket server
    callback(null, true)
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}))
app.use(express.json())
app.use(apiLimiter)
app.use(sessionMiddleware)

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
})

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
    origin: function (origin, callback) {
      callback(null, true)
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    transports: ["websocket", "polling"]
  }
})

const waiting = []
const peers = new Map()
const meta = new Map()

// VIDEO CHAT QUEUES (separate from text chat)
const videoWaiting = []
const videoPeers = new Map()   // socketId -> partnerId (current socket)
const videoMeta = new Map()    // socketId -> metadata

// ─── Grace-window reconnection state ────────────────────────────────────────
// Settings (can be overridden via env)
const GRACE_WINDOW_MS = parseInt(process.env.GRACE_WINDOW_MS ?? '30000')
const MAX_RECONNECT_ATTEMPTS = parseInt(process.env.MAX_RECONNECT_ATTEMPTS ?? '3')
const RECONNECT_BACKOFF_MS = parseInt(process.env.RECONNECT_BACKOFF_MS ?? '2000')

// sessionId (stable, sent by client) -> { socketId, partnerId, graceTimer, state, meta }
const sessionRegistry = new Map()
// socketId -> sessionId  (reverse index for fast lookup)
const socketToSession = new Map()

// Prometheus metrics for reconnects
const pendingReconnectGauge = new client.Gauge({ name: 'aurapal_pending_reconnect_count', help: 'Sessions in pending_reconnect state' })
const reconnectSuccessCounter = new client.Counter({ name: 'aurapal_reconnect_success_total', help: 'Successful reconnections within grace window' })
const endedAfterGraceCounter = new client.Counter({ name: 'aurapal_ended_after_grace_total', help: 'Sessions ended after grace window expired' })

// Basic IP rate limiter for sockets
const ipRateLimits = new Map()

io.on('connection', (socket) => {
  logger.info({ event: 'socket_connect', socketId: socket.id })

  const ip = socket.handshake.address || socket.handshake.headers['x-forwarded-for']
  if (ip) {
    const record = ipRateLimits.get(ip) || { count: 0, resetTime: Date.now() + 60000 }
    if (Date.now() > record.resetTime) {
      record.count = 1
      record.resetTime = Date.now() + 60000
    } else {
      record.count++
    }
    ipRateLimits.set(ip, record)

    if (record.count > 100) {
      logger.warn({ event: 'rate_limit_exceeded', ip })
      socket.disconnect(true)
      return
    }
  }

  socket.on('identify', (info) => {
    if (info?.clientId) {
      const existing = meta.get(socket.id) || {}
      meta.set(socket.id, { ...existing, clientId: info.clientId })
    }
    // Register stable session for reconnection support
    if (info?.sessionId) {
      const sid = info.sessionId
      // Check if there's an existing session for this id
      const existingSession = sessionRegistry.get(sid)
      if (!existingSession) {
        sessionRegistry.set(sid, { socketId: socket.id, state: 'active', graceTimer: null, pendingPartnerId: null })
      } else {
        // Update socket binding (handles reconnection before resume-session is called)
        existingSession.socketId = socket.id
      }
      socketToSession.set(socket.id, sid)
      logger.info({ event: 'session_registered', sessionId: sid, socketId: socket.id })
    }
  })

  socket.on('find_random', (data) => {
    logger.info({ event: 'find_random_received', socketId: socket.id, sessionId: socketToSession.get(socket.id), data })
    meta.set(socket.id, { ...data, socketId: socket.id })

    // React StrictMode or Remount check: if they are ALREADY paired, just remind them!
    const partnerId = peers.get(socket.id)
    if (partnerId) {
      if (!partnerId.startsWith('bot_')) {
        const pMeta = meta.get(partnerId)
        if (pMeta) {
          logger.info({ event: 'repaired_existing', socketId: socket.id })
          socket.emit('paired', { roomId: `room_${socket.id}_${partnerId}`, partner: pMeta })
          return // abort finding a new one
        }
      } else {
         unpair(socket.id, partnerId) // Bot pair, just break and find real human
      }
    }

    if (!waiting.includes(socket.id)) {
      waiting.push(socket.id)
      logger.info({ event: 'added_to_waiting', socketId: socket.id, waitingLength: waiting.length })
    }
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
    const msg = { id: payload.id || `m_${Date.now()}`, text: payload.text, image: payload.image, from: socket.id, timestamp: Date.now() }

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

  // -----------------------------
  // VIDEO CHAT EVENTS
  // -----------------------------

  socket.on('video-find-random', (data) => {
    logger.info({ event: 'video_find_random', socketId: socket.id, data })
    videoMeta.set(socket.id, { ...data, socketId: socket.id, joinTime: Date.now() })

    // React StrictMode or Remount check
    const partnerId = videoPeers.get(socket.id)
    if (partnerId) {
      const pMeta = videoMeta.get(partnerId)
      if (pMeta) {
        logger.info({ event: 'repaired_existing_video', socketId: socket.id })
        // Just re-emit video-ready so they skip queue and setup WebRTC
        socket.emit('video-ready', { partnerId, caller: false })
        return
      }
    }

    if (!videoWaiting.includes(socket.id)) {
      videoWaiting.push(socket.id)
      videoQueueLengthGauge.set(videoWaiting.length)
    }
    tryVideoPair()
  })

  socket.on('video-skip', () => {
    const partnerId = videoPeers.get(socket.id)
    console.log(`[video-skip] ${socket.id} -> partner ${partnerId}`)
    if (partnerId) {
      // Notify partner they were skipped (not ended)
      try { io.to(partnerId).emit('video-skipped') } catch { }
      // Remove both from peers
      videoPeers.delete(socket.id)
      videoPeers.delete(partnerId)
      // Remove partner from queue if there, then re-queue them
      const pi = videoWaiting.indexOf(partnerId)
      if (pi >= 0) videoWaiting.splice(pi, 1)
      videoWaiting.push(partnerId)
    }
    // Re-queue the skipper
    const si = videoWaiting.indexOf(socket.id)
    if (si < 0) {
      videoWaiting.push(socket.id)
    }
    videoQueueLengthGauge.set(videoWaiting.length)
    console.log(`[video-skip] queue length now: ${videoWaiting.length}`)
    tryVideoPair()
  })

  socket.on('video-end', () => {
    logger.info({ event: 'video_end', socketId: socket.id })
    const partnerId = videoPeers.get(socket.id)
    if (partnerId) {
      unpairVideo(socket.id, partnerId)
    }
    const i = videoWaiting.indexOf(socket.id)
    if (i >= 0) {
      videoWaiting.splice(i, 1)
      videoQueueLengthGauge.set(videoWaiting.length)
    }
    videoMeta.delete(socket.id)
  })

  socket.on('video-offer', (payload) => {
    if (!payload || typeof payload !== 'object' || !payload.type || !payload.sdp || payload.sdp.length > 50000) return
    const partnerId = videoPeers.get(socket.id)
    console.log(`[video-offer] ${socket.id} -> ${partnerId}`)
    if (partnerId) {
      io.to(partnerId).emit('video-offer', payload)
    }
  })

  socket.on('video-answer', (payload) => {
    if (!payload || typeof payload !== 'object' || !payload.type || !payload.sdp || payload.sdp.length > 50000) return
    const partnerId = videoPeers.get(socket.id)
    console.log(`[video-answer] ${socket.id} -> ${partnerId}`)
    if (partnerId) {
      io.to(partnerId).emit('video-answer', payload)
    }
  })

  socket.on('ice-candidate', (candidate) => {
    if (!candidate || typeof candidate !== 'object') return
    const partnerId = videoPeers.get(socket.id)
    if (partnerId) {
      io.to(partnerId).emit('ice-candidate', candidate)
    }
  })

  socket.on('disconnect', (reason) => {
    logger.info({ event: 'socket_disconnect', socketId: socket.id, reason })

    // ── Text chat cleanup ────────────────────────────────────────────────────
    const partnerId = peers.get(socket.id)
    if (partnerId) unpair(socket.id, partnerId)
    const i = waiting.indexOf(socket.id)
    if (i >= 0) waiting.splice(i, 1)
    meta.delete(socket.id)

    // ── Video chat: grace-window logic ───────────────────────────────────────
    const sessionId = socketToSession.get(socket.id)
    const session = sessionId ? sessionRegistry.get(sessionId) : null
    const vPartnerId = videoPeers.get(socket.id)

    if (vPartnerId && session) {
      // Mark session as pending reconnect
      session.state = 'pending_reconnect'
      session.socketId = null  // socket is gone
      pendingReconnectGauge.inc()
      logger.info({ event: 'pending_reconnect', sessionId, partnerId: vPartnerId })

      // Notify partner
      try { io.to(vPartnerId).emit('partner-reconnecting', { graceWindowMs: GRACE_WINDOW_MS }) } catch { }

      // Remove old socket mappings but KEEP videoPeers via session
      socketToSession.delete(socket.id)
      videoPeers.delete(socket.id)
      // Store the partner in the session so we can restore on reconnect
      session.pendingPartnerId = vPartnerId

      // Start grace timer
      if (session.graceTimer) clearTimeout(session.graceTimer)
      session.graceTimer = setTimeout(() => {
        // Grace window expired — user did not reconnect
        const sess = sessionRegistry.get(sessionId)
        if (!sess || sess.state !== 'pending_reconnect') return

        const pId = sess.pendingPartnerId
        logger.info({ event: 'ended_after_grace', sessionId, partnerId: pId })
        endedAfterGraceCounter.inc()
        pendingReconnectGauge.dec()
        disconnectCounter.inc()

        if (pId) {
          try { io.to(pId).emit('video-end') } catch { }
          // Clean up partner if they have a session
          const partnerSessionId = socketToSession.get(pId)
          if (partnerSessionId) {
            const partnerSession = sessionRegistry.get(partnerSessionId)
            if (partnerSession) {
              partnerSession.state = 'ended'
              partnerSession.pendingPartnerId = null
            }
          }
          videoPeers.delete(pId)
        }

        sess.state = 'ended'
        sess.pendingPartnerId = null
        sess.graceTimer = null
        sessionRegistry.delete(sessionId)
      }, GRACE_WINDOW_MS)

    } else if (vPartnerId) {
      // No session registered — fall back to immediate cleanup (legacy path)
      logger.info({ event: 'immediate_video_end_no_session', socketId: socket.id })
      try { io.to(vPartnerId).emit('video-end') } catch { }
      videoPeers.delete(socket.id)
      videoPeers.delete(vPartnerId)
      disconnectCounter.inc()
    } else {
      // Not in a video session, just clean up
      socketToSession.delete(socket.id)
    }

    const vi = videoWaiting.indexOf(socket.id)
    if (vi >= 0) {
      videoWaiting.splice(vi, 1)
      videoQueueLengthGauge.set(videoWaiting.length)
    }
    videoMeta.delete(socket.id)
  })

  // ── Resume session after reconnect ──────────────────────────────────────────
  socket.on('resume-session', ({ sessionId }) => {
    if (!sessionId || typeof sessionId !== 'string') return
    const session = sessionRegistry.get(sessionId)

    if (!session || session.state !== 'pending_reconnect') {
      // No pending session found — treat as new user
      socket.emit('session-not-found')
      return
    }

    logger.info({ event: 'reconnected', sessionId, newSocketId: socket.id })

    // Clear grace timer
    if (session.graceTimer) { clearTimeout(session.graceTimer); session.graceTimer = null }

    // Rebind
    const oldSessionId = socketToSession.get(socket.id)
    if (oldSessionId && oldSessionId !== sessionId) socketToSession.delete(socket.id)
    session.socketId = socket.id
    session.state = 'reconnected'
    socketToSession.set(socket.id, sessionId)

    // Restore video peer mapping so signaling continues to work
    const partnerId = session.pendingPartnerId
    if (partnerId) {
      videoPeers.set(socket.id, partnerId)
      videoPeers.set(partnerId, socket.id)
      session.pendingPartnerId = null
    }

    pendingReconnectGauge.dec()
    reconnectSuccessCounter.inc()

    // Notify reconnected user and their partner
    socket.emit('session-resumed', { partnerId })
    if (partnerId) {
      try { io.to(partnerId).emit('partner-reconnected') } catch { }
    }
  })
  function isMatch(a, b) {
    const prefA = (a.genderPreference || a.preferredGender || 'everyone').toLowerCase()
    const prefB = (b.genderPreference || b.preferredGender || 'everyone').toLowerCase()
    const genA = (a.gender || 'unknown').toLowerCase()
    const genB = (b.gender || 'unknown').toLowerCase()

    const aAcceptsB = prefA === 'everyone' || prefA === 'any' || prefA === genB
    const bAcceptsA = prefB === 'everyone' || prefB === 'any' || prefB === genA

    if (a.isPremium) return aAcceptsB
    return aAcceptsB || bAcceptsA
  }


  function tryPair() {
    logger.info({ event: 'try_pair_start', waitingCount: waiting.length })

    // If there are less than 2 people waiting, we can't pair anyone
    while (waiting.length >= 2) {
      // 1. Grab the person who has been waiting the longest (FIFO)
      const userA = waiting.shift()
      const metaA = meta.get(userA)

      // (Safety check in case they disconnected right before this loop)
      if (!metaA) {
        logger.warn({ event: 'pair_failed_no_meta', socketId: userA })
        continue
      }

      // 2. Grab the next person in line
      const userB = waiting.shift()
      const metaB = meta.get(userB)

      if (!metaB) {
        logger.warn({ event: 'pair_failed_no_meta', socketId: userB })
        // Put userA back at the FRONT of the line
        waiting.unshift(userA)
        continue
      }

      // 3. Immediately pair them (Instant matching, ignoring gender/premium for queue speed)
      logger.info({ event: 'paired_instant', a: userA, b: userB })
      const roomId = `room_${userA}_${Date.now()}`
      
      peers.set(userA, userB)
      peers.set(userB, userA)
      
      // Notify both sockets
      io.to(userA).emit('paired', { roomId, partner: metaB })
      io.to(userB).emit('paired', { roomId, partner: metaA })
    }
  }

  function unpair(a, b) {
    peers.delete(a)
    peers.delete(b)
    io.to(a).emit('unpaired')
    io.to(b).emit('unpaired')
  }

  // -----------------------------
  // VIDEO PAIRING LOGIC
  // -----------------------------
  function tryVideoPair() {
    // If there are less than 2 people waiting, we can't pair anyone
    while (videoWaiting.length >= 2) {
      // 1. Grab the person who has been waiting the longest (FIFO)
      const userA = videoWaiting.shift()
      const metaA = videoMeta.get(userA)

      // (Safety check in case they disconnected right before this loop)
      if (!metaA) continue

      // 2. Grab the next person in line
      const userB = videoWaiting.shift()
      const metaB = videoMeta.get(userB)

      if (!metaB) {
        // Put userA back at the FRONT of the line
        videoWaiting.unshift(userA)
        continue
      }

      // 3. Immediately pair them (Instant matching)
      videoPeers.set(userA, userB)
      videoPeers.set(userB, userA)

      const now = Date.now()
      if (metaA.joinTime) videoWaitTimeHistogram.observe((now - metaA.joinTime) / 1000)
      if (metaB.joinTime) videoWaitTimeHistogram.observe((now - metaB.joinTime) / 1000)
      matchSuccessCounter.inc()

      io.to(userA).emit('video-ready', { partner: metaB, turnConfig })
      io.to(userB).emit('video-ready', { partner: metaA, turnConfig })

      videoQueueLengthGauge.set(videoWaiting.length)
    }
  }

  function unpairVideo(a, b) {
    videoPeers.delete(a)
    videoPeers.delete(b)

    try { io.to(a).emit('video-end') } catch { }
    try { io.to(b).emit('video-end') } catch { }

    const ia = videoWaiting.indexOf(a)
    if (ia >= 0) {
      videoWaiting.splice(ia, 1)
      videoQueueLengthGauge.set(videoWaiting.length)
    }

    const ib = videoWaiting.indexOf(b)
    if (ib >= 0) {
      videoWaiting.splice(ib, 1)
      videoQueueLengthGauge.set(videoWaiting.length)
    }
  }

  function findSocketByUserId(userId) {
    for (const [sid, m] of meta.entries()) {
      if (m.clientId === userId) return sid
    }
    return null
  }
})

import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 404 handler for any unbound requests (prevents Express v5 path errors)
app.use((req, res) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    logger.info({ event: 'server_start', port: PORT })
  })
}

export { app, httpServer, io }
