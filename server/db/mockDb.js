const users = new Map()
const messages = []
const friendRequests = []
const friendships = new Map()

export function createUser({ id, name, avatar }) {
  const user = { id, name, avatar }
  users.set(id, user)
  if (!friendships.has(id)) friendships.set(id, new Set())
  return user
}

export function getUser(id) {
  return users.get(id)
}

export function saveMessage(msg) {
  messages.push(msg)
  return msg
}

export function createFriendRequest({ fromId, toId, fromMeta }) {
  const req = { id: `req_${Date.now()}_${Math.floor(Math.random()*9999)}`, fromId, toId, fromMeta, createdAt: Date.now() }
  friendRequests.push(req)
  return req
}

export function acceptFriendRequest(requestId) {
  const idx = friendRequests.findIndex(r => r.id === requestId)
  if (idx === -1) return null
  const req = friendRequests.splice(idx,1)[0]
  const a = friendships.get(req.fromId) || new Set()
  const b = friendships.get(req.toId) || new Set()
  a.add(req.toId)
  b.add(req.fromId)
  friendships.set(req.fromId, a)
  friendships.set(req.toId, b)
  return req
}

export function declineFriendRequest(requestId) {
  const idx = friendRequests.findIndex(r => r.id === requestId)
  if (idx === -1) return null
  const req = friendRequests.splice(idx,1)[0]
  return req
}

export function getFriends(userId) {
  const set = friendships.get(userId) || new Set()
  return Array.from(set).map(id => users.get(id)).filter(Boolean)
}

export function getPendingRequests(userId) {
  return friendRequests.filter(r => r.toId === userId)
}

export default {
  createUser, getUser, saveMessage, createFriendRequest, acceptFriendRequest, declineFriendRequest, getFriends, getPendingRequests
}
