// src/pages/Profile.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { InterestTagInput } from '../components/InterestTagInput'
import { PrivacyToggle } from '../components/PrivacyToggle'
import { Avatar } from '../components/ui/avatar'
import { useAuthStore } from '../store/useStore'
import { useToast } from '../components/ui/use-toast-hook'

export function Profile() {
  const { user, updateProfile, updateDisplayName } = useAuthStore()
  const navigate = useNavigate()
  const { push } = useToast()

  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [handle, setHandle] = useState(user?.handle || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [interests, setInterests] = useState(user?.interests || [])
  const [visibility, setVisibility] = useState(user?.visibility || 'public')

  const handleSave = async () => {
    try {
      const nameRes = updateDisplayName(displayName)
      if (nameRes && !nameRes.success) {
        push({ title: 'Validation Error', description: nameRes.error, variant: 'destructive', duration: 4000 })
        return
      }

      await updateProfile({
        handle,
        bio,
        interests,
        visibility,
      })

      push({
        title: 'Profile updated',
        description: 'Your changes have been saved.',
        variant: 'success',
        duration: 3000,
      })

      navigate('/dashboard', { replace: true })
    } catch {
      push({
        title: 'Error saving profile',
        description: 'Something went wrong. Please try again.',
        variant: 'error',
        duration: 4000,
      })
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p style={{ color: 'var(--muted)' }}>
          You need to sign in to view your profile.
        </p>
      </div>
    )
  }

  return (
    <div
      className="py-8 px-4 sm:py-12"
      style={{ background: 'var(--surface)', color: 'var(--text)' }}
    >
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader className="flex flex-col items-center">
            <Avatar
              src={user.avatar}
              alt={user.displayName}
              initials={user.displayName?.slice(0, 2)}
              size={72}
            />
            <CardTitle className="mt-3 text-2xl">{user.displayName}</CardTitle>
            <CardDescription>{user.handle}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Display Name */}
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Handle */}
            <div>
              <Label htmlFor="handle">Handle</Label>
              <Input
                id="handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="mt-2"
                placeholder="@yourhandle"
              />
              <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
                Your unique identifier on AuraPal
              </p>
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-2 w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-start)]"
                style={{
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  caretColor: 'var(--brand-start)',
                }}
                rows={4}
                placeholder="Tell others about yourself..."
              />
            </div>

            {/* Interests */}
            <div>
              <Label>Interests</Label>
              <p className="mt-1 mb-4 text-xs" style={{ color: 'var(--muted)' }}>
                Add interests to help others find you and to get better match suggestions
              </p>
              <InterestTagInput value={interests} onChange={setInterests} />
            </div>

            {/* Privacy */}
            <div>
              <PrivacyToggle
                value={visibility}
                onChange={setVisibility}
                label="Profile Visibility"
                description="Public profiles can be found by anyone. Private profiles are only visible to people you connect with."
              />
            </div>

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
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}