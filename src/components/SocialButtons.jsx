import React from 'react'
import { Button } from '../ui/button'

export default function SocialButtons() {
  const handleGoogle = () => {
    window.location.href = '/api/auth/google'
  }

  const handleApple = () => {
    window.location.href = '/api/auth/apple'
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleGoogle} className="w-full bg-white text-black border">
        Continue with Google
      </Button>
      <Button onClick={handleApple} className="w-full bg-black text-white">
        Continue with Apple
      </Button>
    </div>
  )
}