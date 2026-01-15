// src/components/MessageThread.jsx
import { useEffect, useRef } from 'react'
import { formatDate } from '../lib/utils'
import { useMessageStore } from '../store/useStore'
import { useAuthStore } from '../store/useStore'

export function MessageThread({ conversationId }) {
  const { messages, conversations } = useMessageStore()
  const { user } = useAuthStore()
  const messagesEndRef = useRef(null)

  const conversation = conversations.find((c) => c.id === conversationId)
  const threadMessages = messages[conversationId] || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [threadMessages])

  if (!conversation) {
    return (
      <div
        className="flex h-full items-center justify-center p-8 text-center"
        style={{ color: 'var(--muted)' }}
      >
        <p>Conversation not found</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {threadMessages.map((msg) => {
          const isOwn = msg.senderId === user?.id || msg.senderId === 'current'
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[70%] rounded-lg px-4 py-2"
                style={{
                  background: isOwn ? 'var(--brand-gradient)' : 'rgba(255,255,255,0.06)',
                  color: isOwn ? 'var(--on-brand, #fff)' : 'var(--text)',
                }}
              >
                <p className="text-sm">{msg.text}</p>
                <p
                  className="mt-1 text-xs"
                  style={{
                    color: isOwn ? 'var(--muted)' : 'var(--muted)',
                  }}
                >
                  {formatDate(msg.timestamp)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}