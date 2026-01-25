import React, { useState } from 'react'
import { Button } from './ui/button'
import SearchOverlay from './SearchOverlay'
import { socket } from '../utils/socket'

export default function StartChat({ guestIdentity, onPaired }) {
  const [searching, setSearching] = useState(false)

  const handleStartChat = () => {
    setSearching(true)
    socket.emit('find_random', {
      guestName: guestIdentity.guestName,
      avatar: guestIdentity.avatar,
      age: guestIdentity.age,
      gender: guestIdentity.gender,
      country: guestIdentity.country,
      clientId: socket.id
    })
  }

  const handleSkip = () => {
    socket.emit('skip_random')
  }

  const handleExit = () => {
    setSearching(false)
    socket.emit('exit')
  }

  if (searching) {
    return <SearchOverlay onSkip={handleSkip} onExit={handleExit} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-cyan-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Ready to Connect?</h1>
        <Button
          size="lg"
          className="px-12 py-4 text-xl font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
          onClick={handleStartChat}
        >
          Start Chat
        </Button>
      </div>
    </div>
  )
}