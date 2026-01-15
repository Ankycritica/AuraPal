// src/pages/SignIn.jsx
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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
import { useAuthStore } from '../store/useStore'
import { useToast } from '../components/ui/Toast'

export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signInAsGuest } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { push } = useToast()

  // If a protected route redirected here, `location.state.from` holds the original location
  const redirectTo = location.state?.from?.pathname || '/onboarding'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn(email.trim(), password)
      if (result?.success) {
        try {
          push?.({
            title: 'Signed in',
            description: `Welcome, ${result.user.displayName}!`,
            duration: 3000,
          })
        } catch {}
        // Navigate back to the original protected route or onboarding
        navigate(redirectTo, { replace: true })
      } else {
        setError(result?.error || 'Invalid email or password')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestSignIn = () => {
    signInAsGuest()
    try {
      push?.({
        title: 'Guest session',
        description: 'You are signed in as a guest with a fun random identity.',
        duration: 3500,
      })
    } catch {}
    // If user was trying to access a protected route, send them there; otherwise dashboard
    const guestRedirect = location.state?.from?.pathname || '/dashboard'
    navigate(guestRedirect, { replace: true })
  }

  return (
    <div
      className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12"
      style={{ background: 'var(--surface)' }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl" style={{ color: 'var(--text)' }}>
            Sign In
          </CardTitle>
          <CardDescription style={{ color: 'var(--muted)' }}>
            Welcome back to AuraPal
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite">
            <div>
              <Label htmlFor="email" style={{ color: 'var(--text)' }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password" style={{ color: 'var(--text)' }}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: 'var(--brand-start)' }}>
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              style={{ background: 'var(--brand-gradient)', color: '#fff' }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span
                  className="w-full border-t"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span
                  className="px-2"
                  style={{ background: 'var(--surface)', color: 'var(--muted)' }}
                >
                  Or
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGuestSignIn}
                disabled={loading}
              >
                Continue as Guest
              </Button>

              <p className="text-center text-sm" style={{ color: 'var(--muted)' }}>
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  style={{ color: 'var(--brand-start)' }}
                  className="hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-xs" style={{ color: 'var(--muted)' }}>
            TODO: Integrate with real auth provider (Magic.Link, Supabase, Auth0, etc.)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}