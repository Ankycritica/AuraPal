import React, { useState, useEffect, useRef } from 'react'
import { Button } from '../components/ui/button'
import { SkipForward, LogOut, UserPlus } from 'lucide-react'

export default function ChatRoom({
  peer,
  messages,
  typing,
  guestId,
  onSend,
  onSkip,
  onExit,
  onAddFriend,
  onTypingStart,
  onTypingStop
}) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue.trim())
      setInputValue('')
      onTypingStop()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    if (e.target.value && !typing) {
      onTypingStart()
    } else if (!e.target.value && typing) {
      onTypingStop()
    }
  }

  // Get user and peer avatars and names
  const userAvatar = localStorage.getItem('anonAvatar') || '😊'
  const userName = localStorage.getItem('anonGuestName') || 'You'
  const peerAvatar = peer ? '🤔' : '🤔' // Could be improved to use peer's avatar if available
  const peerName = peer?.guestName || 'Stranger'

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{userAvatar}</span>
            <div className="text-left">
              <p className="text-sm text-gray-300">{userName}</p>
              <p className="text-xs text-gray-500">
                {localStorage.getItem('anonAge')}, {localStorage.getItem('anonGender')}, {localStorage.getItem('anonCountry')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{peerAvatar}</span>
            <div className="text-left">
              <p className="text-sm text-gray-300">{peerName}</p>
              {peer && (
                <p className="text-xs text-gray-500">
                  {peer.age}, {peer.gender}, {peer.country}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-cyan-400 hover:bg-cyan-400/20 rounded-full"
            title="Skip"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="text-red-400 hover:bg-red-400/20 rounded-full"
            title="Exit"
          >
            <LogOut className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddFriend}
            className="text-purple-400 hover:bg-purple-400/20 rounded-full"
            title="Add Friend"
          >
            <UserPlus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === guestId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-lg ${
                msg.from === guestId
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              {msg.system ? (
                <p className="text-sm text-gray-400 italic">{msg.text}</p>
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-gray-700 px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}