// src/pages/Onboarding.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { InterestTagInput } from '../components/InterestTagInput'
import { PrivacyToggle } from '../components/PrivacyToggle'
import { useAuthStore } from '../store/useStore'
import { useToast } from '../components/ui/use-toast'

export function Onboarding() {
  const [step, setStep] = useState(1)
  const [interests, setInterests] = useState([])
  const [visibility, setVisibility] = useState('public')
  const [bio, setBio] = useState('')
  const { updateProfile, user } = useAuthStore()
  const { push } = useToast()
  const navigate = useNavigate()

  const handleComplete = () => {
    updateProfile({
      interests,
      visibility,
      bio,
    })
    try {
      push?.({
        title: 'Profile setup complete',
        description: `Your AuraPal identity is ready, ${user?.displayName}!`,
        duration: 3500,
      })
    } catch {}
    navigate('/dashboard', { replace: true })
  }

  return (
    <div
      className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12"
      style={{ background: 'var(--surface)' }}
    >
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: 'var(--text)' }}>
            Welcome to AuraPal, {user?.displayName}!
          </CardTitle>
          <CardDescription style={{ color: 'var(--muted)' }}>
            Let's set up your profile to help you connect with like‑minded people.
          </CardDescription>
          <div className="mt-4 flex gap-2">
            <div
              className="h-2 flex-1 rounded"
              style={{ background: step >= 1 ? 'var(--brand-start)' : 'var(--muted)' }}
            />
            <div
              className="h-2 flex-1 rounded"
              style={{ background: step >= 2 ? 'var(--brand-start)' : 'var(--muted)' }}
            />
            <div
              className="h-2 flex-1 rounded"
              style={{ background: step >= 3 ? 'var(--brand-start)' : 'var(--muted)' }}
            />
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-semibold" style={{ color: 'var(--text)' }}>
                  What are you interested in?
                </h3>
                <p className="mb-4 text-sm" style={{ color: 'var(--muted)' }}>
                  Share your interests to help us suggest meaningful connections. You can add or
                  remove interests anytime.
                </p>
                <InterestTagInput value={interests} onChange={setInterests} />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={interests.length === 0}
                  style={{ background: 'var(--brand-gradient)', color: '#fff' }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-semibold" style={{ color: 'var(--text)' }}>
                  Tell us about yourself
                </h3>
                <p className="mb-4 text-sm" style={{ color: 'var(--muted)' }}>
                  A short bio helps others understand who you are and what you're looking for.
                </p>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short bio..."
                  className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    caretColor: 'var(--brand-start)',
                    focusRingColor: 'var(--brand-start)',
                  }}
                  rows={4}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  style={{ background: 'var(--brand-gradient)', color: '#fff' }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-semibold" style={{ color: 'var(--text)' }}>
                  Privacy Settings
                </h3>
                <p className="mb-4 text-sm" style={{ color: 'var(--muted)' }}>
                  Choose who can see your profile. You can change this anytime in settings.
                </p>
                <PrivacyToggle
                  value={visibility}
                  onChange={setVisibility}
                  label="Profile Visibility"
                  description="Public profiles can be found by anyone. Private profiles are only visible to people you connect with."
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  style={{ background: 'var(--brand-gradient)', color: '#fff' }}
                >
                  Complete Setup
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}