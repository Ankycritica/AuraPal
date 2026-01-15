// src/store/useStore.js
import { create } from 'zustand'
import { mockUsers, mockConversations, mockMessages, mockSuggestedMatches } from '../lib/mockData'

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
      // ignore storage errors (e.g., quota)
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

// A small curated list of catchy adjectives and nouns to combine into memorable names.
// You can expand these lists as you like.
const ADJECTIVES = [
  'Velvet', 'Crimson', 'Neon', 'Lunar', 'Solar', 'Echo', 'Silver', 'Golden', 'Misty', 'Sonic',
  'Azure', 'Blaze', 'Frost', 'Velox', 'Nova', 'Pixel', 'Orbit', 'Quasar', 'Breeze', 'Nimbus',
]
const NOUNS = [
  'Comet', 'Raven', 'Pulse', 'Voyager', 'Wisp', 'Harbor', 'Drift', 'Beacon', 'Cipher', 'Atlas',
  'Sprite', 'Mosaic', 'Glider', 'Tide', 'Aurora', 'Pioneer', 'Riddle', 'Cascade', 'Summit', 'Haven',
]

// Pick a random element from an array
function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Generate a catchy display name like "NeonComet" or "Velvet-Atlas42"
function generateCatchyName() {
  const adj = rand(ADJECTIVES)
  const noun = rand(NOUNS)
  // Add a small chance to append a short number for uniqueness
  const suffix = Math.random() < 0.25 ? String(Math.floor(Math.random() * 90) + 10) : ''
  return `${adj}${noun}${suffix}`
}

// Create a simple SVG avatar data URL using initials and a deterministic color derived from the name.
// This avoids external dependencies and produces a unique-looking avatar per name.
function stringToColor(str) {
  // simple hash to color
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
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function generateAvatarDataUrl(name) {
  const initials = initialsFromName(name)
  const bg = stringToColor(name)
  // Slightly darker circle color and lighter gradient for visual interest
  const circleColor = bg
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
    <text x='50%' y='62%' text-anchor='middle' font-family='Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' font-size='72' fill='${textColor}' font-weight='700'>${initials}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/**
 * Auth store
 *
 * Exposes:
 * - signIn(email, password)
 * - signUp(email, password, displayName)
 * - signInAsGuest()
 * - signOut()
 * - updateProfile(updates)
 * - checkSession() -> boolean (true if session still valid)
 * - refreshSession(ttlMs) -> extends session expiry (useful after activity)
 * - getCurrentUser()
 *
 * Notes:
 * - Session expiry is represented by session.expiresAt (ms since epoch).
 * - checkSession is a pure check (returns boolean). It does NOT sign the user out automatically.
 *   This keeps side effects (toasts, UI) in the caller so they can show notifications before signOut.
 */
const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  session: null,

  // Sign in with email/password (mock)
  signIn: async (email, password) => {
    if (!email || !password) {
      return { success: false, error: 'Missing credentials' }
    }

    // TODO: Replace with real auth provider integration
    // If this is the first time (no persisted user), assign a catchy name + avatar
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
      session: { token: 'mock-token', expiresAt: Date.now() + 10 * 60 * 1000 }, // 10 minutes
    }

    set(newState)
    persistStorage.setItem('aurapal-auth', {
      user: newState.user,
      isAuthenticated: newState.isAuthenticated,
      isGuest: newState.isGuest,
      session: newState.session,
    })

    return { success: true, user: mockUser }
  },

  // Sign up (mock)
  signUp: async (email, password, displayNameInput) => {
    if (!email || !password) {
      return { success: false, error: 'Missing credentials' }
    }

    // If user provided a displayName use it; otherwise generate a catchy one
    const displayName = displayNameInput && displayNameInput.trim().length > 0 ? displayNameInput.trim() : generateCatchyName()
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
      session: { token: 'mock-token', expiresAt: Date.now() + 10 * 60 * 1000 }, // 10 minutes
    }

    set(newState)
    persistStorage.setItem('aurapal-auth', {
      user: newState.user,
      isAuthenticated: newState.isAuthenticated,
      isGuest: newState.isGuest,
      session: newState.session,
    })

    return { success: true, user: mockUser }
  },

  // Guest sign in (mock)
  signInAsGuest: () => {
    // Guests also get a catchy display name and avatar for parity with random chats
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
      session: { token: 'guest-token', expiresAt: Date.now() + 10 * 60 * 1000 }, // 10 minutes
    }

    set(newState)
    persistStorage.setItem('aurapal-auth', {
      user: newState.user,
      isAuthenticated: newState.isAuthenticated,
      isGuest: newState.isGuest,
      session: newState.session,
    })
  },

  // Sign out (clears auth state)
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

  // Update profile fields for current user
  updateProfile: (updates) => {
    set((state) => {
      if (!state.user) return {}
      const updatedUser = { ...state.user, ...updates }
      const newState = { ...state, user: updatedUser }
      persistStorage.setItem('aurapal-auth', {
        user: newState.user,
        isAuthenticated: newState.isAuthenticated,
        isGuest: newState.isGuest,
        session: newState.session,
      })
      return newState
    })
  },

  /**
   * checkSession
   * Returns true if there is a session and it has not expired.
   * Does NOT perform signOut; caller should call signOut() if they want to end the session.
   */
  checkSession: () => {
    const { session } = get()
    if (!session) return false
    return session.expiresAt > Date.now()
  },

  /**
   * refreshSession
   * Extend the current session expiry by ttlMs (default 10 minutes).
   * Useful to call on user activity to keep session alive.
   */
  refreshSession: (ttlMs = 10 * 60 * 1000) => {
    set((state) => {
      if (!state.session) return {}
      const updated = { ...state, session: { ...state.session, expiresAt: Date.now() + ttlMs } }
      persistStorage.setItem('aurapal-auth', {
        user: updated.user,
        isAuthenticated: updated.isAuthenticated,
        isGuest: updated.isGuest,
        session: updated.session,
      })
      return updated
    })
  },

  // Helper to get current user
  getCurrentUser: () => get().user,
}))

/**
 * Initialize auth store from persisted snapshot.
 * If persisted session exists but is expired, clear it immediately.
 */
if (persistedAuth && (persistedAuth.user || persistedAuth.isAuthenticated)) {
  // If session exists and is expired, clear persisted auth
  const session = persistedAuth.session
  if (session && session.expiresAt && session.expiresAt < Date.now()) {
    // expired: clear persisted auth
    persistStorage.removeItem('aurapal-auth')
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      session: null,
    })
  } else {
    // valid: restore
    useAuthStore.setState({
      user: persistedAuth.user || null,
      isAuthenticated: !!persistedAuth.isAuthenticated,
      isGuest: !!persistedAuth.isGuest,
      session: persistedAuth.session || null,
    })
  }
}

// Persist selected auth fields whenever they change
useAuthStore.subscribe((state) => {
  try {
    persistStorage.setItem('aurapal-auth', {
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isGuest: state.isGuest,
      session: state.session,
    })
  } catch {
    // ignore
  }
})

/**
 * Message store
 * - conversations, messages, helpers for send/simulate/block/report
 */
const useMessageStore = create((set, get) => ({
  conversations: mockConversations,
  currentConversationId: null,
  messages: mockMessages,
  reports: [],

  setCurrentConversation: (conversationId) => {
    set({ currentConversationId: conversationId })
  },

  sendMessage: (conversationId, text) => {
    // TODO: Integrate with WebSocket/real-time service
    const message = {
      id: `msg-${Date.now()}`,
      senderId: 'current',
      text,
      timestamp: new Date().toISOString(),
    }

    set((state) => {
      const messages = { ...state.messages }
      if (!messages[conversationId]) {
        messages[conversationId] = []
      }
      messages[conversationId] = [...messages[conversationId], message]

      const conversations = state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: {
                text,
                timestamp: message.timestamp,
                senderId: 'current',
              },
            }
          : conv
      )

      return { messages, conversations }
    })
  },

  simulateIncomingMessage: (conversationId) => {
    // Dev helper: simulate incoming message
    const conversation = get().conversations.find((c) => c.id === conversationId)
    if (!conversation) return

    const incomingMessage = {
      id: `msg-${Date.now()}`,
      senderId: conversation.participantId,
      text: 'This is a simulated incoming message for testing UI interactions.',
      timestamp: new Date().toISOString(),
    }

    set((state) => {
      const messages = { ...state.messages }
      if (!messages[conversationId]) {
        messages[conversationId] = []
      }
      messages[conversationId] = [...messages[conversationId], incomingMessage]

      const conversations = state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: {
                text: incomingMessage.text,
                timestamp: incomingMessage.timestamp,
                senderId: conversation.participantId,
              },
              unreadCount: (conv.unreadCount || 0) + 1,
            }
          : conv
      )

      return { messages, conversations }
    })
  },

  blockUser: (userId) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.participantId === userId ? { ...conv, isBlocked: true } : conv
      ),
    }))
  },

  unblockUser: (userId) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.participantId === userId ? { ...conv, isBlocked: false } : conv
      ),
    }))
  },

  reportUser: (userId, reason, note) => {
    // TODO: Send to backend moderation API
    const report = {
      id: `report-${Date.now()}`,
      userId,
      reason,
      note,
      timestamp: new Date().toISOString(),
    }
    set((state) => ({ reports: [...state.reports, report] }))
  },
}))

/**
 * Match store (simple mock-backed)
 */
const useMatchStore = create(() => ({
  suggestedMatches: mockSuggestedMatches,
  allUsers: mockUsers,
}))

export { useAuthStore, useMessageStore, useMatchStore }