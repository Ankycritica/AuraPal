// src/components/AnonymousOnboarding.jsx
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { useNavigate } from 'react-router-dom'

export function AnonymousOnboarding({ onComplete }) {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [country, setCountry] = useState('')
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
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
    if (!age || !gender || !country) return
    // Store in localStorage for session use
    localStorage.setItem('anonAge', age)
    localStorage.setItem('anonGender', gender)
    localStorage.setItem('anonCountry', country)
    onComplete()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Detecting your location...</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <Card style={{ background: 'var(--surface)', color: 'var(--text)', maxWidth: 420 }}>
        <CardHeader>
          <CardTitle className="text-xl">Before you start…</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
            I AGREE, LET’S GO!
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