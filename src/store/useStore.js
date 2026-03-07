// src/store/useStore.js
import { create } from 'zustand'

/**
 * Lightweight localStorage wrapper with safe JSON parse/stringify.
 */
const persistStorage = {
  getItem: (name) => {
    try {
      const item = localStorage.getItem(name)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, JSON.stringify(value))
    } catch {
      // ignore storage errors
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name)
    } catch {
      // ignore
    }
  },
}

// Load persisted auth snapshot (if any)
const persistedAuth = persistStorage.getItem('aurapal-auth') || {
  user: null,
  isAuthenticated: false,
  isGuest: false,
  session: null,
}

/**
 * Helpers for generating catchy random display names and SVG avatar data URLs.
 */
const ADJECTIVES = [
  'Velvet', 'Crimson', 'Neon', 'Lunar', 'Solar', 'Echo', 'Silver', 'Golden', 'Misty', 'Sonic',
  'Azure', 'Blaze', 'Frost', 'Velox', 'Nova', 'Pixel', 'Orbit', 'Quasar', 'Breeze', 'Nimbus',
]
const NOUNS = [
  'Comet', 'Raven', 'Pulse', 'Voyager', 'Wisp', 'Harbor', 'Drift', 'Beacon', 'Cipher', 'Atlas',
  'Sprite', 'Mosaic', 'Glider', 'Tide', 'Aurora', 'Pioneer', 'Riddle', 'Cascade', 'Summit', 'Haven',
]

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateCatchyName() {
  const adj = rand(ADJECTIVES)
  const noun = rand(NOUNS)
  const suffix = Math.random() < 0.25 ? String(Math.floor(Math.random() * 90) + 10) : ''
  return `${adj}${noun}${suffix}`
}

function stringToColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue} 70% 50%)`
}

function initialsFromName(name) {
  if (!name) return 'A'
  const parts = name.replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function generateAvatarDataUrl(name) {
  const initials = initialsFromName(name)
  const bg = stringToColor(name)
  const textColor = '#ffffff'
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'>
    <defs>
      <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
        <stop offset='0' stop-color='${bg}' stop-opacity='0.95'/>
        <stop offset='1' stop-color='${bg}' stop-opacity='0.75'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)' rx='32' />
    <circle cx='128' cy='96' r='56' fill='rgba(255,255,255,0.06)' />
    <text x='50%' y='62%' text-anchor='middle' font-family='Inter' font-size='72' fill='${textColor}' font-weight='700'>${initials}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/**
 * AUTH STORE
 */
const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  session: null,

  signIn: async (email, password) => {
    if (!email || !password) return { success: false, error: 'Missing credentials' }

    const displayName = generateCatchyName()
    const avatar = generateAvatarDataUrl(displayName)

    const mockUser = {
      id: 'current',
      email,
      displayName,
      handle: `@${displayName.replace(/\s+/g, '').toLowerCase()}`,
      bio: '',
      interests: [],
      avatar,
      visibility: 'public',
      createdAt: new Date().toISOString(),
    }

    const newState = {
      user: mockUser,
      isAuthenticated: true,
      isGuest: false,
      session: { token: 'mock-token', expiresAt: Date.now() + 10 * 60 * 1000 },
    }

    set(newState)
    persistStorage.setItem('aurapal-auth', newState)
    return { success: true, user: mockUser }
  },

  signUp: async (email, password, displayNameInput) => {
    if (!email || !password) return { success: false, error: 'Missing credentials' }

    const displayName =
      displayNameInput?.trim().length > 0 ? displayNameInput.trim() : generateCatchyName()
    const avatar = generateAvatarDataUrl(displayName)

    const mockUser = {
      id: 'current',
      email,
      displayName,
      handle: `@${displayName.replace(/\s+/g, '').toLowerCase()}`,
      bio: '',
      interests: [],
      avatar,
      visibility: 'public',
      createdAt: new Date().toISOString(),
    }

    const newState = {
      user: mockUser,
      isAuthenticated: true,
      isGuest: false,
      session: { token: 'mock-token', expiresAt: Date.now() + 10 * 60 * 1000 },
    }

    set(newState)
    persistStorage.setItem('aurapal-auth', newState)
    return { success: true, user: mockUser }
  },

  signInAsGuest: () => {
    const displayName = generateCatchyName()
    const avatar = generateAvatarDataUrl(displayName)

    const guestUser = {
      id: `guest-${Date.now()}`,
      email: null,
      displayName,
      handle: `@${displayName.replace(/\s+/g, '').toLowerCase()}`,
      bio: '',
      interests: [],
      avatar,
      visibility: 'public',
      createdAt: new Date().toISOString(),
    }

    const newState = {
      user: guestUser,
      isAuthenticated: true,
      isGuest: true,
      session: { token: 'guest-token', expiresAt: Date.now() + 10 * 60 * 1000 },
    }

    set(newState)
    persistStorage.setItem('aurapal-auth', newState)
  },

  signOut: () => {
    const newState = {
      user: null,
      isAuthenticated: false,
      isGuest: false,
      session: null,
    }
    set(newState)
    persistStorage.setItem('aurapal-auth', newState)
  },

  updateProfile: (updates) => {
    set((state) => {
      if (!state.user) return {}
      const updatedUser = { ...state.user, ...updates }
      const newState = { ...state, user: updatedUser }
      persistStorage.setItem('aurapal-auth', newState)
      return newState
    })
  },

  updateDisplayName: (name) => {
    const trimmed = name?.trim() ?? ''
    if (trimmed.length < 3 || trimmed.length > 20) return { success: false, error: 'Name must be 3–20 characters.' }
    const bad = /\b(fuck|shit|ass|bitch|nigger|faggot)\b/i
    if (bad.test(trimmed)) return { success: false, error: 'Name contains disallowed words.' }
    set((state) => {
      if (!state.user) return {}
      const updatedUser = { ...state.user, displayName: trimmed, avatar: generateAvatarDataUrl(trimmed) }
      const newState = { ...state, user: updatedUser }
      persistStorage.setItem('aurapal-auth', newState)
      return newState
    })
    return { success: true }
  },

  checkSession: () => {
    const { session } = get()
    if (!session) return false
    return session.expiresAt > Date.now()
  },

  refreshSession: (ttlMs = 10 * 60 * 1000) => {
    set((state) => {
      if (!state.session) return {}
      const updated = {
        ...state,
        session: { ...state.session, expiresAt: Date.now() + ttlMs },
      }
      persistStorage.setItem('aurapal-auth', updated)
      return updated
    })
  },

  getCurrentUser: () => get().user,
}))

/**
 * Restore persisted auth
 */
if (persistedAuth && (persistedAuth.user || persistedAuth.isAuthenticated)) {
  const session = persistedAuth.session
  if (session && session.expiresAt < Date.now()) {
    persistStorage.removeItem('aurapal-auth')
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      session: null,
    })
  } else {
    useAuthStore.setState({
      user: persistedAuth.user || null,
      isAuthenticated: !!persistedAuth.isAuthenticated,
      isGuest: !!persistedAuth.isGuest,
      session: persistedAuth.session || null,
    })
  }
}

useAuthStore.subscribe((state) => {
  try {
    persistStorage.setItem('aurapal-auth', state)
  } catch { }
})

/**
 * MESSAGE STORE
 */
const useMessageStore = create((set, get) => ({
  conversations: [],
  currentConversationId: null,
  messages: {},
  reports: [],

  setCurrentConversation: (conversationId) => {
    set({ currentConversationId: conversationId })
  },

  sendMessage: (conversationId, text) => {
    const message = {
      id: `msg-${Date.now()}`,
      senderId: 'current',
      text,
      timestamp: new Date().toISOString(),
    }

    set((state) => {
      const messages = { ...state.messages }
      if (!messages[conversationId]) messages[conversationId] = []
      messages[conversationId] = [...messages[conversationId], message]

      return { messages }
    })
  },

  simulateIncomingMessage: () => { },
  blockUser: () => { },
  unblockUser: () => { },
  reportUser: () => { },
}))

/**
 * MATCH STORE — CLEAN VERSION (NO MOCK USERS)
 */
const useMatchStore = create((set) => ({
  suggestedMatches: [],
  allUsers: [],

  setSuggestedMatches: (matches) => set({ suggestedMatches: matches }),
  setAllUsers: (users) => set({ allUsers: users }),
}))

/**
 * FRIEND STORE
 */
const useFriendStore = create((set) => ({
  friends: [],          // [{ id, displayName, avatar }]
  incoming: [],         // [{ requestId, fromUserId, fromName, fromAvatar }]

  addFriend: (friend) => set((s) => {
    if (s.friends.some(f => f.id === friend.id)) return {}
    return { friends: [...s.friends, friend] }
  }),

  removeFriend: (id) => set((s) => ({ friends: s.friends.filter(f => f.id !== id) })),

  addIncoming: (req) => set((s) => {
    if (s.incoming.some(r => r.requestId === req.requestId)) return {}
    return { incoming: [...s.incoming, req] }
  }),

  removeIncoming: (requestId) => set((s) => ({ incoming: s.incoming.filter(r => r.requestId !== requestId) })),
}))

export { useAuthStore, useMessageStore, useMatchStore, useFriendStore }
