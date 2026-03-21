import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function Footer() {
  const [stars] = React.useState(() => [...Array(60)].map(() => ({
    top: Math.random() * 100 + '%',
    left: Math.random() * 100 + '%',
    width: Math.random() * 1.5 + 'px',
    height: Math.random() * 1.5 + 'px',
    opacity: Math.random() * 0.5,
    duration: 3 + Math.random() * 5,
    delay: Math.random() * 10
  })))

  return (
    <footer className="relative pt-12 pb-8 overflow-hidden">
      {/* 🌌 Design Requirements: Dark gradient background (deep navy → teal) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#0d9488]/20 z-0" />
      
      {/* 🌌 Design Requirements: Small star-like dots scattered across the background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            initial={{ opacity: star.opacity }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ 
              duration: star.duration, 
              repeat: Infinity, 
              delay: star.delay 
            }}
            className="absolute bg-white rounded-full"
            style={{ 
              width: star.width, 
              height: star.height,
              top: star.top, 
              left: star.left 
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 gap-x-8 lg:gap-16">
          
          {/* Column 1 — AuraPal */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-black text-white tracking-tight">AuraPal</h3>
            <p className="text-sm text-white/50 leading-relaxed font-medium">
              Privacy-first community for real connection.
            </p>
          </div>

          {/* Column 2 — Product */}
          <div>
            <h4 className="text-sm font-black text-white mb-6 uppercase tracking-[0.2em]">Product</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li>
                <Link to="/#features" className="text-white/50 hover:text-white transition-colors duration-300">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-white/50 hover:text-white transition-colors duration-300">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-white/50 hover:text-white transition-colors duration-300">
                  Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Company */}
          <div>
            <h4 className="text-sm font-black text-white mb-6 uppercase tracking-[0.2em]">Company</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li>
                <Link to="/about" className="text-white/50 hover:text-white transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-white/50 hover:text-white transition-colors duration-300">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Legal */}
          <div>
            <h4 className="text-sm font-black text-white mb-6 uppercase tracking-[0.2em]">Legal</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li>
                <Link to="/privacy" className="text-white/50 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/50 hover:text-white transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT LINE: Centered text */}
        <div className="mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-[11px] font-black text-white/30 tracking-[0.3em] uppercase">
            © 2026 AuraPal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}