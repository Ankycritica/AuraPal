import { io } from 'socket.io-client'

const DEFAULT_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

let socket = null
let connectedIdentity = null

function ensureSocket() {
  return socket
}

export function connect(identity) {
  if (socket) return socket
  connectedIdentity = identity
  socket = io(DEFAULT_URL, {
    transports: ["websocket", "polling"],
    withCredentials: true
  })

  socket.on('connect', () => {
    console.log('Socket connected')
  })

  socket.on('connect_error', (err) => {
    console.warn('socket connect_error', err)
  })

  return socket
}

export function disconnect() {
  if (!socket) return
  try { socket.disconnect() } catch (e) {}
  socket = null
  connectedIdentity = null
}

function safeEmit(event, payload, cb) {
  if (!socket || !socket.connected) {
    if (cb) cb({ ok: false, reason: 'disconnected' })
    return
  }
  socket.emit(event, payload, cb)
}

export function findRandom() {
  const identity = JSON.parse(localStorage.getItem('ap-guest-identity') || '{}')
  const data = {
    age: identity.age,
    gender: identity.gender,
    country: identity.country,
    guestName: identity.guestName,
    preferredGender: identity.preferredGender || 'Any',
    isPremium: false // TODO: check premium status
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
export function sendMessage(msg, cb) { safeEmit('chat_message', msg, cb) }
export function sendFriendRequest(toId, fromMeta = {}) { safeEmit('friend_request', { toId, fromMeta }) }
export function respondFriendRequest(requestId, accept) { safeEmit('friend_response', { requestId, accept }) }
export function reportUser(userId, reason) { safeEmit('report_user', { userId, reason }) }
export function blockUser(userId) { safeEmit('block_user', { userId }) }

export function on(event, cb) {
  const s = ensureSocket()
  if (!s) return () => {}
  s.on(event, cb)
  return () => s.off(event, cb)
}

export function off(event, cb) {
  const s = ensureSocket()
  if (!s) return
  s.off(event, cb)
}

export default {
  connect, disconnect, findRandom, skipRandom, stopRandom, sendMessage,
  sendFriendRequest, respondFriendRequest, reportUser, blockUser, on, off
}
