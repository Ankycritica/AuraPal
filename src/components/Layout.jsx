import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { useAuthStore } from '../store/useStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Menu, User, LogOut, Settings, MessageSquare, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import logo from '../assets/AURAPAL.png'
import { Footer } from './Footer'

export function Layout({ children }) {
  const { isAuthenticated, user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isHomePage = location.pathname === '/' || ['/omegle-alternative', '/random-chat', '/anonymous-chat', '/chat-with-strangers', '/chat-platform'].includes(location.pathname)

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div 
      className="flex min-h-screen flex-col transition-colors duration-300" 
      style={{ 
        background: 'var(--ap-dark)', 
        color: 'var(--text)',
        '--btn-primary-bg': 'linear-gradient(90deg, var(--ap-indigo), #6366F1)',
        '--btn-primary-text': '#ffffff',
        '--btn-outline-border': 'rgba(255,255,255,0.2)',
        '--btn-outline-text': '#ffffff',
        '--btn-ghost-text': 'var(--muted)',
        '--btn-link-text': 'var(--ap-indigo)',
      }}
    >
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <header
        className="sticky top-0 z-50 border-b transition-colors duration-300"
        style={{ 
          background: 'rgba(9,9,11,0.8)', 
          backdropFilter: 'blur(10px)', 
          borderColor: 'rgba(255,255,255,0.05)' 
        }}
      >
        <nav className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-4 px-4 py-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {/* Left: logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-4">
              <img src={logo} alt="AuraPal" className="h-12 w-auto sm:h-16" />
              <span className="text-2xl font-bold tracking-tight text-white">
                AuraPal
              </span>
            </Link>
          </div>

          {/* Center: nav */}
          <div className="hidden justify-center md:flex">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-sm font-medium hover:text-ap-indigo transition-colors" style={{ color: 'var(--muted)' }}>
                Home
              </Link>
              <Link to="/features" className="text-sm font-medium hover:text-ap-indigo transition-colors" style={{ color: 'var(--muted)' }}>
                Features
              </Link>
              <Link to="/pricing" className="text-sm font-medium hover:text-ap-indigo transition-colors" style={{ color: 'var(--muted)' }}>
                Pricing
              </Link>
              <Link to="/safety" className="text-sm font-medium hover:text-ap-indigo transition-colors" style={{ color: 'var(--muted)' }}>
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
                <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Link to="/signup" style={{ color: 'var(--text)' }}>Sign Up</Link>
                </Button>
                <Button
                  size="sm"
                  className="hidden sm:inline-flex bg-ap-indigo hover:bg-indigo-600 text-white shadow-md transition-all active:scale-95"
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

      {/* Mobile Sticky CTA — only on home/landing pages */}
      {isHomePage && (
        <div className="mobile-sticky-cta sm:hidden">
          <button
            onClick={() => navigate('/chat')}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-ap-indigo to-ap-emerald text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform animate-pulse-glow"
          >
            Start Chatting Now <ArrowRight size={16} strokeWidth={3} />
          </button>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Layout