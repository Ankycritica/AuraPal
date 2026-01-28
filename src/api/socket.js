import { io } from 'socket.io-client'

const DEFAULT_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

let _socket = null
let pendingListeners = []

export function getSocket() {
  return _socket
}

function applyPendingListeners() {
  if (!_socket || !pendingListeners.length) return
  pendingListeners.forEach(({ event, cb }) => _socket.on(event, cb))
  pendingListeners = []
}

export function connect(identity) {
  if (_socket) return _socket

  _socket = io(DEFAULT_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true
  })

  _socket.on('connect', () => {
    console.log('Socket connected', _socket.id)
    applyPendingListeners()
    try {
      _socket.emit('identify', {
        guestName: identity?.guestName || identity?.name,
        country: identity?.country,
        age: identity?.age,
        gender: identity?.gender
      })
    } catch (e) {
      console.warn('identify emit failed', e)
    }
  })

  _socket.on('connect_error', (err) => {
    console.warn('socket connect_error', err)
  })

  _socket.on('disconnect', (reason) => {
    console.warn('socket disconnected', reason)
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
