import React from 'react'
import { Button } from './ui/button'

export default function SearchOverlay({ onSkip, onExit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto border-4 border-ap-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-4">Searching for a stranger…</h2>
        <div className="flex justify-center space-x-2 mb-8">
          <div className="w-3 h-3 bg-ap-accent rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-ap-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-ap-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <div className="flex space-x-4">
          <Button onClick={onSkip} variant="outline" className="text-white border-white">
            Skip
          </Button>
          <Button onClick={onExit} variant="destructive">
            Exit
          </Button>
        </div>
      </div>
    </div>
  )
}