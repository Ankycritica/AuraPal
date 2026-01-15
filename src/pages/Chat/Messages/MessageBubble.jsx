import React from 'react'

function TimeAndStatus({ message, isOwn }) {
  const time = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
  return (
    <div className="text-xs text-gray-400 flex items-center gap-2">
      <div>{time}</div>
      {isOwn && (
        <div className="text-xs">
          {message.status === 'pending' && '...'}
          {message.status === 'delivered' && '✓✓'}
          {message.status === 'seen' && <span className="text-orange-400">✓✓</span>}
        </div>
      )}
    </div>
  )
}

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${isOwn ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg ring-1 ring-pink-500/20' : 'bg-gray-800 text-gray-100 border border-gray-700'}`}>
        <div className="whitespace-pre-wrap">{message.text}</div>
        <div className="mt-2">
          <TimeAndStatus message={message} isOwn={isOwn} />
        </div>
      </div>
    </div>
  )
}
