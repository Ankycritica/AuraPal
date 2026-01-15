// src/components/AnonymousOnboarding.jsx
import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useNavigate } from 'react-router-dom'

export function AnonymousOnboarding({ onComplete }) {
  const [gender, setGender] = useState('')
  const [ageConfirmed, setAgeConfirmed] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = () => {
    if (!gender || !ageConfirmed) return
    // store in localStorage for session use
    localStorage.setItem('anonGender', gender)
    localStorage.setItem('anonAgeConfirmed', 'true')
    onComplete()
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <Card style={{ background: 'var(--surface)', color: 'var(--text)', maxWidth: 420 }}>
        <CardHeader>
          <CardTitle className="text-xl">Before you start…</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="mb-2 text-sm" style={{ color: 'var(--muted)' }}>
              Select your gender so we can match you with the right people.
            </p>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={(e) => setGender(e.target.value)}
                /> Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={(e) => setGender(e.target.value)}
                /> Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={gender === 'other'}
                  onChange={(e) => setGender(e.target.value)}
                /> Prefer not to say
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
              />
              I’m at least 18 years old and agree to the{' '}
              <a href="/terms" style={{ color: 'var(--brand-start)' }}>Terms of Service</a> and{' '}
              <a href="/privacy" style={{ color: 'var(--brand-start)' }}>Privacy Policy</a>.
            </label>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!gender || !ageConfirmed}
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