import { io } from 'socket.io-client'

// When running locally on network (e.g., 192.168.x.x), we need to connect to the same host on port 3000
// rather than defaulting strictly to localhost. For production (Vercel), it should relative.
const isLocalNetwork = typeof window !== 'undefined' && 
  (window.location.hostname.includes('192.168.') || 
   window.location.hostname.includes('10.') ||
   window.location.hostname === 'localhost')

const getBaseUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL
  if (isLocalNetwork) return `http://${window.location.hostname}:3000`
  return '' // production uses same domain usually
}

const DEFAULT_URL = getBaseUrl()

let _socket = null
let pendingListeners = []

// ─── Stable session ID ───────────────────────────────────────────────────────
function getOrCreateSessionId() {
  let sid = sessionStorage.getItem('ap-session-id')
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem('ap-session-id', sid)
  }
  return sid
}

export const SESSION_ID = getOrCreateSessionId()

export function getSocket() {
  return _socket
}

function applyPendingListeners() {
  if (!_socket || !pendingListeners.length) return
  pendingListeners.forEach(({ event, cb }) => _socket.on(event, cb))
  pendingListeners = []
}

export function connect(identity) {
  if (_socket) return _socket   // always reuse — never create a second socket

  _socket = io(DEFAULT_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
  })

  _socket.on('connect', () => {
    console.log('[Socket] connected id:', _socket.id)
    applyPendingListeners()
    try {
      _socket.emit('identify', {
        sessionId: SESSION_ID,
        guestName: identity?.guestName || identity?.name,
        country: identity?.country,
        age: identity?.age,
        gender: identity?.gender,
      })
    } catch (e) {
      console.warn('[Socket] identify emit failed', e)
    }
  })

  _socket.on('connect_error', (err) => {
    console.warn('[Socket] connect_error', err.message)
  })

  _socket.on('disconnect', (reason) => {
    console.warn('[Socket] disconnected', reason)
  })

  return _socket
}

export function disconnect() {
  if (!_socket) return
  try {
    _socket.disconnect()
  } catch (e) {
    console.warn('socket disconnect error', e)
  }
  _socket = null
  pendingListeners = []
}

function safeEmit(event, payload, cb) {
  const s = getSocket()
  if (!s || !s.connected) {
    if (cb) cb({ ok: false, reason: 'disconnected' })
    console.warn(`Cannot emit ${event} — socket disconnected`)
    return
  }
  s.emit(event, payload, cb)
}

export function findRandom() {
  const identity = JSON.parse(localStorage.getItem('ap-guest-identity') || '{}')
  const data = {
    age: identity.age,
    gender: identity.gender,
    country: identity.country,
    guestName: identity.guestName || identity.name,
    preferredGender: identity.preferredGender || 'Any',
    isPremium: !!identity.isPremium
  }
  console.log('Emitting find_random with data:', data)
  safeEmit('find_random', data)
}

export function skipRandom() {
  console.log('Emitting skip_random')
  safeEmit('skip_random')
}

export function stopRandom() {
  console.log('Emitting exit')
  safeEmit('exit')
}

export function sendMessage(msg, cb) {
  safeEmit('chat_message', msg, cb)
}

export function sendFriendRequest(toId, fromMeta = {}) {
  safeEmit('friend_request', { toId, fromMeta })
}

export function respondFriendRequest(requestId, accept) {
  safeEmit('friend_response', { requestId, accept })
}

export function reportUser(userId, reason) {
  safeEmit('report_user', { userId, reason })
}

export function blockUser(userId) {
  safeEmit('block_user', { userId })
}

export function on(event, cb) {
  const s = getSocket()
  if (!s) {
    pendingListeners.push({ event, cb })
    return () => {
      pendingListeners = pendingListeners.filter(
        (l) => l.cb !== cb || l.event !== event
      )
    }
  }
  s.on(event, cb)
  return () => s.off(event, cb)
}

export function off(event, cb) {
  const s = getSocket()
  if (!s) {
    pendingListeners = pendingListeners.filter(
      (l) => l.cb !== cb || l.event !== event
    )
    return
  }
  s.off(event, cb)
}

export default {
  connect,
  disconnect,
  findRandom,
  skipRandom,
  stopRandom,
  sendMessage,
  sendFriendRequest,
  respondFriendRequest,
  reportUser,
  blockUser,
  on,
  off,
  getSocket
}
