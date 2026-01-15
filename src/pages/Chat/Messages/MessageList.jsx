import React, { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

export default function MessageList({ messages, typing, guestId }) {
  const listRef = useRef(null)

  useEffect(() => {
    if (!listRef.current) return
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) listRef.current.scrollTop = listRef.current.scrollHeight
    else listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  return (
    <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-4 bg-gray-900">
      {messages.map((m) => (
        m.system ? (
          <div key={m.id} className="text-center text-sm text-gray-400">{m.text}</div>
        ) : (
          <MessageBubble key={m.id} message={m} isOwn={m.from === guestId} />
        )
      ))}

      {typing && (
        <div className="text-sm text-gray-400">Stranger is typing<span className="ml-2">•••</span></div>
      )}
    </div>
  )
}
