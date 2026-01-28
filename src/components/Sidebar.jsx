import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Instagram, Twitter } from 'lucide-react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

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
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg hover:bg-purple-500/20 transition-colors"
      >
        {isOpen ? (
          <X size={24} className="text-purple-400" />
        ) : (
          <Menu size={24} className="text-purple-400" />
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
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900/50 via-purple-900/30 to-slate-900/50 border-r border-purple-500/20 p-6 flex flex-col gap-6 z-40 transform transition-all duration-300 lg:relative lg:translate-x-0 lg:w-72 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="text-3xl">🌐</div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              AuraPal
            </h1>
            <p className="text-xs text-purple-300/60">Connect Anonymously</p>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex gap-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-purple-500/30 transition-all duration-200 text-purple-300/70 hover:text-purple-300 hover:scale-110"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-purple-500/30 transition-all duration-200 text-purple-300/70 hover:text-purple-300 hover:scale-110"
          >
            <Twitter size={20} />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-purple-500/30 transition-all duration-200 text-purple-300/70 hover:text-purple-300 hover:scale-110"
          >
            <span className="text-lg">🎵</span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item, idx) => {
            const isActive = item.id === 'chat'
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/40 to-cyan-600/30 text-purple-100 border border-purple-500/40'
                    : 'text-purple-200/70 hover:text-purple-200 hover:bg-purple-500/10'
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
              className="bg-gradient-to-br from-purple-600/30 to-orange-500/20 border border-orange-400/30 rounded-xl p-4 flex flex-col gap-3"
              onClick={handlePremium}
              style={{ cursor: 'pointer' }}
            >
              <p className="text-sm font-bold text-orange-300">✨ Get Premium</p>
              <ul className="text-xs space-y-2 text-purple-200/70">
                {premiumPerks.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <button
                className="mt-2 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm font-bold py-2 rounded-lg transition-all hover:scale-105"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* User Identity */}
        <div className="mt-auto pt-6 border-t border-purple-500/20">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors cursor-pointer">
            <div className="text-2xl">{identity.avatar || '😊'}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-purple-200 truncate">
                {identity.guestName || 'Guest'}
              </p>
              <p className="text-xs text-purple-300/60">
                {isPremium ? '⭐ Premium' : 'Free Account'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
