import { useEffect, useState, useCallback } from 'react'

const KEY = 'ap-guest-identity'
const ONBOARDED_KEY = 'ap-anonymous-onboarded'

export function useGuest() {
  const [guest, setGuest] = useState(null)
  const [isOnboarded, setIsOnboarded] = useState(
    localStorage.getItem(ONBOARDED_KEY) === 'true'
  )

  // Load guest identity once on mount
  useEffect(() => {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      try {
        setGuest(JSON.parse(raw))
      } catch {
        setGuest(null)
      }
    }
  }, [])

  // Save identity to localStorage
  const saveGuest = useCallback((data) => {
    localStorage.setItem(KEY, JSON.stringify(data))
    setGuest(data)
  }, [])

  // Called by chat with identity data
  const startAsGuest = useCallback((data) => {
    saveGuest(data)
    localStorage.setItem(ONBOARDED_KEY, 'true')
    setIsOnboarded(true)
  }, [saveGuest])

  return {
    guest,
    saveGuest,
    startAsGuest,
    isOnboarded,
    setOnboarded: (v) => {
      localStorage.setItem(ONBOARDED_KEY, v ? 'true' : 'false')
      setIsOnboarded(v)
    }
  }
}

export default useGuest
