import { useEffect, useState, useCallback } from 'react'
import { generateGuestIdentity } from '../utils/generateGuestIdentity'

const ONBOARDED_KEY = 'ap-anonymous-onboarded'

export function useGuest() {
  const [guest, setGuest] = useState(() => {
    try {
      const raw = localStorage.getItem('ap-guest-identity')
      return raw ? JSON.parse(raw) : null
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
    const g = generateGuestIdentity()
    setGuest(g)
    return g
  }, [])

  const setOnboarded = useCallback((v = true) => {
    try { localStorage.setItem(ONBOARDED_KEY, v ? 'true' : 'false') } catch (e) {}
    setIsOnboardedState(!!v)
  }, [])

  return { guest, startAsGuest, isOnboarded, setOnboarded }
}

export default useGuest
