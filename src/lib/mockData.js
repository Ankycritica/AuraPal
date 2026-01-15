// Mock data fixtures for development
// TODO: Replace with real API calls

export const mockUsers = [
  {
    id: 'user1',
    displayName: 'Alex',
    handle: '@alex_connects',
    bio: 'Love hiking, reading, and meaningful conversations. Looking for genuine connections.',
    interests: ['hiking', 'reading', 'philosophy', 'nature'],
    avatar: null,
    visibility: 'public',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user2',
    displayName: 'Sam',
    handle: '@sam_mindful',
    bio: 'Yoga instructor and meditation enthusiast. Building community one conversation at a time.',
    interests: ['yoga', 'meditation', 'wellness', 'community'],
    avatar: null,
    visibility: 'public',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user3',
    displayName: 'Jordan',
    handle: '@jordan_creative',
    bio: 'Artist and writer. Passionate about authentic expression and creative collaboration.',
    interests: ['art', 'writing', 'photography', 'creativity'],
    avatar: null,
    visibility: 'public',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user4',
    displayName: 'Morgan',
    handle: '@morgan_tech',
    bio: 'Tech enthusiast who values privacy and ethical innovation. Always learning.',
    interests: ['technology', 'privacy', 'ethics', 'learning'],
    avatar: null,
    visibility: 'public',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockSuggestedMatches = [
  {
    userId: 'user1',
    score: 0.85,
    mutualInterests: ['hiking', 'nature'],
    reason: 'Shared interests in outdoor activities',
  },
  {
    userId: 'user2',
    score: 0.72,
    mutualInterests: ['wellness', 'community'],
    reason: 'Similar values around mindfulness',
  },
  {
    userId: 'user3',
    score: 0.68,
    mutualInterests: ['creativity'],
    reason: 'Creative pursuits alignment',
  },
]

export const mockConversations = [
  {
    id: 'conv1',
    participantId: 'user1',
    participantName: 'Alex',
    participantHandle: '@alex_connects',
    lastMessage: {
      text: 'Thanks for the book recommendation!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      senderId: 'user1',
    },
    unreadCount: 2,
    isBlocked: false,
  },
  {
    id: 'conv2',
    participantId: 'user2',
    participantName: 'Sam',
    participantHandle: '@sam_mindful',
    lastMessage: {
      text: 'Looking forward to our next chat!',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      senderId: 'current',
    },
    unreadCount: 0,
    isBlocked: false,
  },
]

export const mockMessages = {
  conv1: [
    {
      id: 'msg1',
      senderId: 'current',
      text: 'Hey! I saw you like hiking too. Any favorite trails?',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg2',
      senderId: 'user1',
      text: 'Hi! Yes, I love the mountain trails near here. Have you tried the Blue Ridge trail?',
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg3',
      senderId: 'current',
      text: 'Not yet, but it sounds amazing!',
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg4',
      senderId: 'user1',
      text: 'Thanks for the book recommendation!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],
  conv2: [
    {
      id: 'msg5',
      senderId: 'user2',
      text: 'Hello! I noticed we share an interest in mindfulness practices.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg6',
      senderId: 'current',
      text: 'Yes! I\'ve been exploring meditation lately. Any tips?',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg7',
      senderId: 'user2',
      text: 'Looking forward to our next chat!',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

export const mockReports = []

