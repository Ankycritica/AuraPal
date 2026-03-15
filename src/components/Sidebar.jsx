import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuthStore } from '../store/useStore'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isGuest } = useAuthStore()

  const identity = JSON.parse(localStorage.getItem('ap-guest-identity') || '{}')
  const isPremium = localStorage.getItem('ap-premium') === 'true'

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const navItems = [
    { label: 'Chat', icon: '💬', id: 'chat' },
    { label: 'Friends', icon: '👥', id: 'friends' },
    { label: 'Messages', icon: '✉️', id: 'messages' }
  ]

  const premiumPerks = [
    'Unlock gender filters',
    'Send images & media',
    'Ad-free experience',
    'Priority matching'
  ]

  const handlePremium = () => {
    navigate('/pricing')
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        {isOpen ? (
          <X size={24} className="text-muted" />
        ) : (
          <Menu size={24} className="text-muted" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-zinc-900 border-r border-white/5 p-6 flex flex-col gap-6 z-40 transform transition-all duration-300 lg:relative lg:translate-x-0 lg:w-72 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="text-3xl">🌐</div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              AuraPal
            </h1>
            <p className="text-xs text-zinc-500">Connect Anonymously</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item, idx) => {
            const isActive = item.id === 'chat'

            if (item.id === 'friends' && (!isAuthenticated || isGuest)) {
              return (
                <div key={idx} className="mt-2 px-3 py-3 rounded-lg border border-dashed border-white/10 bg-zinc-900/50 text-center">
                  <p className="text-[11px] text-zinc-500 leading-tight">Sign in to view and manage your friends.</p>
                </div>
              )
            }
            if (item.id === 'messages' && (!isAuthenticated || isGuest)) return null

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${isActive
                  ? 'bg-white/10 text-white border border-white/5'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            )
          })}
        </nav>

        {/* Premium Promo */}
        {!isPremium && (
          <div className="flex-1 flex flex-col gap-4">
            <div
              className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col gap-3 hover:bg-amber-500/20 transition-colors cursor-pointer"
              onClick={handlePremium}
            >
              <p className="text-sm font-bold text-amber-300">✨ Get Premium</p>
              <ul className="text-xs space-y-2 text-zinc-400">
                {premiumPerks.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span className="text-zinc-200">{perk}</span>
                  </li>
                ))}
              </ul>
              <button
                className="mt-2 w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-sm font-bold py-2 rounded-lg hover:scale-105 transition-all shadow-lg"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* User Identity */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800 hover:bg-zinc-750 transition-colors cursor-pointer border border-transparent hover:border-white/10">
            <div className="text-2xl">{identity.avatar || '😊'}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {identity.guestName || 'Guest'}
              </p>
              <p className="text-xs text-zinc-400">
                {isPremium ? '⭐ Premium' : 'Free Account'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
