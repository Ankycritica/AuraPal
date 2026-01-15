import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAuthStore } from '../store/useStore'

export function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const { signUp } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    // TODO: Replace with real auth integration
    try {
      const result = await signUp(email, password, displayName)
      if (result.success) {
        navigate('/onboarding')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12" style={{ background: 'var(--surface)' }}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl" style={{ color: 'var(--text)' }}>Get Started</CardTitle>
          <CardDescription style={{ color: 'var(--muted)' }}>Create your AuraPal account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="displayName" style={{ color: 'var(--text)' }}>Display Name</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="email" style={{ color: 'var(--text)' }}>Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password" style={{ color: 'var(--text)' }}>Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
                At least 8 characters
              </p>
            </div>
            {error && <p className="text-sm" style={{ color: 'var(--brand-start)' }}>{error}</p>}
            <Button type="submit" className="w-full" style={{ background: 'var(--brand-gradient)', color: '#fff' }}>
              Create Account
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm" style={{ color: 'var(--muted)' }}>
              Already have an account?{' '}
              <Link to="/signin" style={{ color: 'var(--brand-start)' }} className="hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-4 text-center text-xs" style={{ color: 'var(--muted)' }}>
            TODO: Integrate with real auth provider (Magic.Link, Supabase, Auth0, etc.)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}