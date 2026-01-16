// src/components/AnonymousOnboarding.jsx
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { useNavigate } from 'react-router-dom'
import { generateGuestIdentity } from '../../server/utils/generateGuestIdentity'

export function AnonymousOnboarding({ onComplete }) {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [country, setCountry] = useState('')
  const [guestIdentity, setGuestIdentity] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    // Generate guest identity
    const identity = generateGuestIdentity()
    setGuestIdentity(identity)

    // Autodetect country using IP geolocation
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setCountry(data.country_name || 'Unknown')
        setLoading(false)
      })
      .catch(() => {
        setCountry('Unknown')
        setLoading(false)
      })
  }, [])

  const handleSubmit = () => {
    if (!age || !gender || !country || !guestIdentity) return
    // Store in localStorage for session use
    localStorage.setItem('anonAge', age)
    localStorage.setItem('anonGender', gender)
    localStorage.setItem('anonCountry', country)
    localStorage.setItem('anonGuestName', guestIdentity.name)
    localStorage.setItem('anonAvatar', guestIdentity.avatar)
    onComplete()
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
        <div className="text-white">Setting up your guest identity...</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90 backdrop-blur-sm">
      <Card style={{ background: 'var(--surface)', color: 'var(--text)', maxWidth: 420, width: '90%' }}>
        <CardHeader>
          <CardTitle className="text-xl text-center">Welcome to AuraPal</CardTitle>
          <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
            Let's set up your anonymous profile
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Guest Identity Display */}
          <div className="text-center">
            <div className="text-4xl mb-2">{guestIdentity.avatar}</div>
            <p className="text-lg font-semibold">{guestIdentity.name}</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Your guest identity</p>
          </div>

          <div>
            <label className="block mb-2 text-sm" style={{ color: 'var(--muted)' }}>
              Age
            </label>
            <Input
              type="number"
              min="18"
              max="99"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm" style={{ color: 'var(--muted)' }}>
              Gender
            </label>
            <Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' }
              ]}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm" style={{ color: 'var(--muted)' }}>
              Country (auto-detected)
            </label>
            <Input
              value={country}
              disabled
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={true}
                disabled
              />
              I’m at least 18 years old and agree to the{' '}
              <a href="/terms" style={{ color: 'var(--brand-start)' }}>Terms of Service</a> and{' '}
              <a href="/privacy" style={{ color: 'var(--brand-start)' }}>Privacy Policy</a>.
            </label>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!age || !gender || !country}
            style={{ background: 'var(--brand-gradient)', color: '#fff', width: '100%' }}
          >
            Continue as {guestIdentity.name}
          </Button>

          <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
            Already have an account?{' '}
            <span
              onClick={() => navigate('/signin')}
              style={{ color: 'var(--brand-start)', cursor: 'pointer' }}
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}