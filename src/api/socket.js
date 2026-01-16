import { io } from 'socket.io-client'

const DEFAULT_URL = (import.meta.env.VITE_WS_URL) || 'http://localhost:3000'

let socket = null
let connectedIdentity = null

function ensureSocket() {
  return socket
}

export function connect(identity) {
  if (socket) return socket
  connectedIdentity = identity
  socket = io(DEFAULT_URL, {
    auth: { identity },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 4000,
    transports: ['websocket'],
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
  const age = localStorage.getItem('anonAge')
  const gender = localStorage.getItem('anonGender')
  const country = localStorage.getItem('anonCountry')
  const guestName = localStorage.getItem('anonGuestName')
  safeEmit('find_random', { age, gender, country, guestName })
}
export function skipRandom() { safeEmit('skip_random') }
export function stopRandom() { safeEmit('stop_random') }
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
