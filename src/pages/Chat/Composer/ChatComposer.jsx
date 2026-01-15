import React, { useState, useRef, useEffect } from 'react'

export default function ChatComposer({ onSend, onTypingStart, onTypingStop, disabled }) {
  const [text, setText] = useState('')
  const typingTimer = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { try { inputRef.current?.focus() } catch {} }, [])

  const handleChange = (e) => {
    setText(e.target.value)
    onTypingStart && onTypingStart()
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => onTypingStop && onTypingStop(), 1200)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    onSend && onSend(t)
    setText('')
    onTypingStop && onTypingStop()
  }

  return (
    <div className="border-t border-gray-700 p-4 bg-gray-800">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          ref={inputRef}
          value={text}
          onChange={handleChange}
          placeholder="Type a message..."
          disabled={disabled}
          className="flex-1 rounded-md px-3 py-2 bg-gray-900 text-white border border-gray-700 focus:outline-none disabled:opacity-50"
        />

        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md disabled:opacity-50"
          disabled={disabled || !text.trim()}
        >
          Send
        </button>
      </form>
    </div>
  )
}
