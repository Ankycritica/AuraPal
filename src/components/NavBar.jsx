// src/components/NavBar.jsx
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { Avatar } from './ui/avatar'
import { useAuthStore } from '../store/useStore'
import { useToast } from './ui/Toast'
import { ThemeToggle } from '../ThemeToggle'
import { useGuest } from '../hooks/useGuest'

export function NavBar() {
  const [open, setOpen] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const mobileNavRef = useRef(null)
  const toggleButtonRef = useRef(null)

  // Auth state/actions
  const { user, isAuthenticated, checkSession, signOut, refreshSession } = useAuthStore()

  // Toast
  const { push } = useToast()
  
  // Guest
  const { startAsGuest } = useGuest()

  // Close mobile nav on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false)
  }, [location.pathname])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Session auto-check: immediately and every 60s
  useEffect(() => {
    const runCheck = () => {
      const valid = checkSession()
      if (!valid) {
        push({
          title: 'Session expired',
          description: 'You have been signed out. Please sign in again to continue.',
          duration: 6000,
        })
        signOut()
        navigate('/signin', { replace: true })
      }
    }
    runCheck()
    const interval = setInterval(runCheck, 60 * 1000)
    return () => clearInterval(interval)
  }, [checkSession, signOut, push, navigate])

  // Refresh session on user activity
  useEffect(() => {
    let timeout = null
    const refresh = () => {
      if (isAuthenticated) {
        refreshSession()
      }
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        timeout = null
      }, 1000)
    }

    window.addEventListener('mousemove', refresh)
    window.addEventListener('keydown', refresh)
    window.addEventListener('touchstart', refresh)

    return () => {
      window.removeEventListener('mousemove', refresh)
      window.removeEventListener('keydown', refresh)
      window.removeEventListener('touchstart', refresh)
      if (timeout) clearTimeout(timeout)
    }
  }, [isAuthenticated, refreshSession])

  const handleSignOut = () => {
    signOut()
    push({ title: 'Signed out', description: 'You have been signed out.', duration: 3000 })
    navigate('/signin', { replace: true })
  }

  return (
    <>
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:z-50 focus:inline-block"
        style={{
          position: 'absolute',
          left: 8,
          top: 8,
          background: 'var(--surface)',
          color: 'var(--brand-start)',
          padding: '0.25rem 0.5rem',
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        Skip to content
      </a>

      <header
        className="w-full border-b sticky top-0 z-40"
        style={{
          background: 'var(--surface)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 gap-4">
          {/* Brand + Logo (left, shrink-0) */}
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="AuraPal home">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: 'var(--brand-gradient)' }}
            >
              <span style={{ color: 'var(--on-brand, #fff)', fontWeight: 700 }}>A</span>
            </div>
            <span style={{ color: 'var(--text)', fontWeight: 700 }} className="hidden sm:inline text-lg">
              AuraPal
            </span>
          </Link>

          {/* Desktop nav (left-center, hidden on mobile) */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/matches', label: 'Matches' },
              { to: '/messages', label: 'Messages' },
              { to: '/settings', label: 'Settings' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="px-3 py-2 rounded-md text-sm font-medium"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--brand-start)' : 'var(--muted)',
                  background: isActive ? 'rgba(255,255,255,0.02)' : 'transparent',
                  outline: 'none',
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Spacer (grows to push actions right) */}
          <div className="flex-1" />

          {/* Actions / Mobile toggle (right, shrink-0) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme toggle (reusable component) */}
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2" aria-label="Your profile">
                  <Avatar
                    src={user.avatar}
                    alt={user.displayName}
                    initials={user.displayName?.slice(0, 2)}
                    size={32}
                  />
                  <span style={{ color: 'var(--text)' }} className="text-sm hidden lg:inline">
                    {user.displayName}
                  </span>
                </Link>

                <Button
                  asChild
                  size="sm"
                  style={{
                    background: 'var(--brand-gradient)',
                    color: 'var(--on-brand, #fff)',
                  }}
                >
                  <Link to="/messages">Message</Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  style={{ color: 'var(--muted)' }}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  style={{ color: 'var(--muted)' }}
                >
                  <Link to="/signin">Sign in</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    try {
                      startAsGuest()
                      navigate('/chat')
                    } catch (err) {
                      console.warn('Guest sign-in failed', err)
                      navigate('/chat')
                    }
                  }}
                  aria-label="Start chat as stranger"
                  style={{ color: 'var(--on-brand)', borderColor: 'transparent' }}
                >
                  Start Chat as Stranger
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              ref={toggleButtonRef}
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded p-2"
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              style={{ color: 'var(--muted)' }}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav
          id="mobile-nav"
          ref={mobileNavRef}
          className="md:hidden border-t"
          style={{
            borderColor: 'rgba(255,255,255,0.06)',
            background: 'var(--surface)',
            transition: 'transform 220ms ease, opacity 180ms ease',
            transform: open ? 'translateY(0)' : 'translateY(-6px)',
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
          }}
          aria-hidden={!open}
        >
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-2">
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/matches', label: 'Matches' },
              { to: '/messages', label: 'Messages' },
              { to: '/settings', label: 'Settings' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium"
                style={{ color: 'var(--muted)' }}
              >
                {item.label}
              </NavLink>
            ))}

            <div className="pt-2">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <Avatar
                    src={user.avatar}
                    alt={user.displayName}
                    initials={user.displayName?.slice(0, 2)}
                    size={36}
                  />
                  <div>
                    <div style={{ color: 'var(--text)', fontWeight: 600 }}>
                      {user.displayName}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                      {user.handle}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        asChild
                        style={{
                          background: 'var(--brand-gradient)',
                          color: 'var(--on-brand, #fff)',
                        }}
                      >
                        <Link to="/messages" onClick={() => setOpen(false)}>
                          New Message
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setOpen(false)
                          handleSignOut()
                        }}
                        style={{ color: 'var(--muted)', borderColor: 'rgba(255,255,255,0.06)' }}
                      >
                        Sign out
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link to="/signin" style={{ color: 'var(--muted)' }} onClick={() => setOpen(false)}>
                    Sign in
                  </Link>
                  <Button
                    asChild
                    style={{
                      background: 'var(--brand-gradient)',
                      color: 'var(--on-brand, #fff)',
                    }}
                  >
                    <Link to="/signup" onClick={() => setOpen(false)}>
                      Get started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}