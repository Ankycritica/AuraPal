import { useEffect, useState, useCallback } from 'react'
import { generateGuestIdentity } from '../utils/generateGuestIdentity'

const ONBOARDED_KEY = 'ap-anonymous-onboarded'

export function useGuest() {
  const [guest, setGuest] = useState(() => {
    try {
      const raw = localStorage.getItem('ap-guest-identity')
      if (raw) return JSON.parse(raw)
      
      // Check if we have stored guest info from onboarding
      const storedName = localStorage.getItem('anonGuestName')
      const storedAvatar = localStorage.getItem('anonAvatar')
      if (storedName && storedAvatar) {
        const g = { id: `guest_${Date.now()}`, name: storedName, avatar: storedAvatar, avatarEmoji: storedAvatar }
        localStorage.setItem('ap-guest-identity', JSON.stringify(g))
        return g
      }
      
      return null
    } catch (e) { return null }
  })

  const [isOnboarded, setIsOnboardedState] = useState(() => {
    try { return localStorage.getItem(ONBOARDED_KEY) === 'true' } catch (e) { return false }
  })

  useEffect(() => {
    if (!guest) {
      const g = generateGuestIdentity()
      setGuest(g)
    }
  }, [guest])

  const startAsGuest = useCallback(() => {
    let g = guest
    if (!g) {
      const storedName = localStorage.getItem('anonGuestName')
      const storedAvatar = localStorage.getItem('anonAvatar')
      if (storedName && storedAvatar) {
        g = { id: `guest_${Date.now()}`, name: storedName, avatar: storedAvatar, avatarEmoji: storedAvatar }
      } else {
        g = generateGuestIdentity()
      }
      setGuest(g)
      localStorage.setItem('ap-guest-identity', JSON.stringify(g))
    }
    return g
  }, [guest])

  const setOnboarded = useCallback((v = true) => {
    try { localStorage.setItem(ONBOARDED_KEY, v ? 'true' : 'false') } catch (e) {}
    setIsOnboardedState(!!v)
  }, [])

  return { guest, startAsGuest, isOnboarded, setOnboarded }
}

export default useGuest
