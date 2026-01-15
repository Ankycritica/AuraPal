// src/components/MessageList.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../lib/utils'
import { useMessageStore } from '../store/useStore'

function ConversationLink({ conv }) {
  const [hover, setHover] = useState(false)

  return (
    <Link
      to={`/messages/${conv.id}`}
      className="block p-4 transition-colors"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'rgba(255,255,255,0.02)' : 'transparent',
      }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar Circle */}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: 'var(--brand-start)',
          }}
        >
          <span className="text-lg font-semibold">
            {conv.participantName[0]}
          </span>
        </div>

        {/* Conversation Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold" style={{ color: 'var(--text)' }}>
              {conv.participantName}
            </h3>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {formatDate(conv.lastMessage.timestamp)}
            </span>
          </div>
          <p className="mt-1 truncate text-sm" style={{ color: 'var(--muted)' }}>
            {conv.lastMessage.text}
          </p>
        </div>

        {/* Unread Badge */}
        {conv.unreadCount > 0 && (
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold"
            style={{
              background: 'var(--brand-start)',
              color: 'var(--on-brand, #fff)',
            }}
          >
            {conv.unreadCount}
          </div>
        )}
      </div>
    </Link>
  )
}

export function MessageList() {
  const { conversations } = useMessageStore()
  const visibleConversations = conversations.filter((conv) => !conv.isBlocked)

  if (visibleConversations.length === 0) {
    return (
      <div
        className="flex h-full items-center justify-center p-8 text-center"
        style={{ color: 'var(--muted)' }}
      >
        <p>No conversations yet. Start connecting with people!</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-[rgba(255,255,255,0.06)]">
      {visibleConversations.map((conv) => (
        <ConversationLink key={conv.id} conv={conv} />
      ))}
    </div>
  )
}