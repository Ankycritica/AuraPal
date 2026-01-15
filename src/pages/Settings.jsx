// src/pages/Settings.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Toggle } from '../components/ui/toggle'
import { useAuthStore } from '../store/useStore'
import { useToast } from '../components/ui/Toast'

export function Settings() {
  const { user, updateProfile, signOut } = useAuthStore()
  const navigate = useNavigate()
  const { push } = useToast()

  const [notifications, setNotifications] = useState(
    user?.preferences?.notifications ?? true
  )
  const [privateAccount, setPrivateAccount] = useState(
    user?.visibility === 'private'
  )
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        preferences: { ...(user?.preferences || {}), notifications },
        visibility: privateAccount ? 'private' : 'public',
      })
      push({
        title: 'Settings saved',
        description: 'Your preferences have been updated.',
        variant: 'success',   // ✅ green toast
        duration: 3000,
      })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      push({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'error',     // ✅ red toast
        duration: 4000,
      })
      console.error('Failed to save settings', err)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = () => {
    signOut()
    push({
      title: 'Signed out',
      description: 'You have been signed out.',
      variant: 'info',       // ✅ cyan toast
      duration: 3000,
    })
    navigate('/signin', { replace: true })
  }

  return (
    <div
      className="py-8 px-4 sm:py-12"
      style={{ background: 'var(--surface)', color: 'var(--text)' }}
    >
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Settings</CardTitle>
            <CardDescription>
              Manage account preferences and privacy
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Notifications Section */}
            <section>
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-sm mt-1 mb-3" style={{ color: 'var(--muted)' }}>
                Control push and email notifications
              </p>
              <div className="flex items-center gap-4">
                <Toggle
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
                <span style={{ color: 'var(--muted)' }}>Enable notifications</span>
              </div>
            </section>

            {/* Privacy Section */}
            <section>
              <h3 className="font-semibold">Privacy</h3>
              <p className="text-sm mt-1 mb-3" style={{ color: 'var(--muted)' }}>
                Control who can find and message you
              </p>
              <div className="flex items-center gap-4">
                <Toggle
                  checked={privateAccount}
                  onCheckedChange={setPrivateAccount}
                />
                <span style={{ color: 'var(--muted)' }}>Private account</span>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                style={{
                  background: 'var(--brand-gradient)',
                  color: 'var(--on-brand, #fff)',
                }}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                style={{
                  color: 'var(--muted)',
                  borderColor: 'rgba(255,255,255,0.06)',
                }}
              >
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}