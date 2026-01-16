import React from 'react'
import { Button } from '../components/ui/button'

export default function StartChat({ onStart }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-cyan-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Ready to Connect?</h1>
        <Button
          size="lg"
          className="px-12 py-4 text-xl font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
          onClick={onStart}
        >
          Start Chat
        </Button>
      </div>
    </div>
  )
}