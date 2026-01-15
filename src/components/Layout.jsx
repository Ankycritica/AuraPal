import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { useAuthStore } from '../store/useStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Menu, User, LogOut, Settings, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import logo from '../assets/AURAPAL.png'

export function Layout({ children }) {
  const { isAuthenticated, user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--bg-dark)', color: 'var(--text)' }}>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: 'rgba(6,16,36,0.6)', backdropFilter: 'blur(6px)', borderColor: 'rgba(255,255,255,0.04)' }}
      >
        <nav className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-4 px-4 py-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {/* Left: logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="AuraPal" className="h-8 w-auto sm:h-10" />
              <span className="text-lg font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
                AuraPal
              </span>
            </Link>
          </div>

          {/* Center: nav */}
          <div className="hidden justify-center md:flex">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
                Home
              </Link>
              <Link to="/features" className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
                Features
              </Link>
              <Link to="/pricing" className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
                Pricing
              </Link>
              <Link to="/safety" className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
                Safety
              </Link>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center justify-end gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  size="sm"
                  className="hidden sm:inline-flex"
                  onClick={() => navigate('/chat?mode=text')}
                >
                  Start Chat
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span style={{ color: 'var(--text)' }}>{user?.displayName || 'Account'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" style={{ background: 'var(--surface)', borderColor: 'rgba(255,255,255,0.03)' }}>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2" style={{ color: 'var(--muted)' }}>
                        <Settings className="h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/messages" className="flex items-center gap-2" style={{ color: 'var(--muted)' }}>
                        <MessageSquare className="h-4 w-4" />
                        Messages
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} style={{ color: 'var(--muted)' }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/signin" style={{ color: 'var(--muted)' }}>Sign In</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                  <Link to="/signup" style={{ color: 'var(--text)' }}>Sign Up</Link>
                </Button>
                <Button
                  size="sm"
                  className="hidden sm:inline-flex"
                  onClick={() => navigate('/chat?mode=text')}
                >
                  Start Chat
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" style={{ color: 'var(--text)' }} />
            </Button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="border-t md:hidden" style={{ borderColor: 'rgba(255,255,255,0.03)', background: 'var(--surface)' }}>
            <div className="space-y-1 px-4 pb-4 pt-2">
              <Link
                to="/"
                className="block rounded-md px-3 py-2 text-base font-medium"
                style={{ color: 'var(--muted)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/features"
                className="block rounded-md px-3 py-2 text-base font-medium"
                style={{ color: 'var(--muted)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="block rounded-md px-3 py-2 text-base font-medium"
                style={{ color: 'var(--muted)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/safety"
                className="block rounded-md px-3 py-2 text-base font-medium"
                style={{ color: 'var(--muted)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Safety
              </Link>

              <div className="pt-2">
                {isAuthenticated ? (
                  <>
                    <Button
                      className="w-full"
                      onClick={() => {
                        navigate('/chat?mode=text')
                        setMobileMenuOpen(false)
                      }}
                    >
                      Start Chat
                    </Button>
                    <Link
                      to="/profile"
                      className="mt-2 block rounded-md px-3 py-2 text-base font-medium"
                      style={{ color: 'var(--muted)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/messages"
                      className="block rounded-md px-3 py-2 text-base font-medium"
                      style={{ color: 'var(--muted)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Messages
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left text-base font-medium"
                      style={{ color: 'var(--muted)' }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="block rounded-md px-3 py-2 text-base font-medium"
                      style={{ color: 'var(--muted)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block rounded-md px-3 py-2 text-base font-medium"
                      style={{ color: 'var(--muted)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                    <Button
                      className="mt-2 w-full"
                      onClick={() => {
                        navigate('/chat?mode=text')
                        setMobileMenuOpen(false)
                      }}
                    >
                      Start Chat
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t py-12" style={{ borderColor: 'rgba(255,255,255,0.03)', background: 'var(--surface)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>AuraPal</h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
                Privacy-first community for real connection.
              </p>
            </div>
            <div>
              <h4 className="font-semibold" style={{ color: 'var(--text)' }}>Product</h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <Link to="/features" style={{ color: 'var(--muted)' }} className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" style={{ color: 'var(--muted)' }} className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/safety" style={{ color: 'var(--muted)' }} className="hover:text-white">
                    Safety
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold" style={{ color: 'var(--text)' }}>Company</h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <Link to="/about" style={{ color: 'var(--muted)' }} className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/safety" style={{ color: 'var(--muted)' }} className="hover:text-white">
                    Community Guidelines
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold" style={{ color: 'var(--text)' }}>Legal</h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <a href="#" style={{ color: 'var(--muted)' }} className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: 'var(--muted)' }} className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm" style={{ borderColor: 'rgba(255,255,255,0.03)', color: 'var(--muted)' }}>
            <p>&copy; {new Date().getFullYear()} AuraPal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout