// src/components/Footer.jsx
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer
      className="w-full border-t mt-12"
      style={{
        background: 'var(--surface)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--brand-start), var(--brand-gradient))' }}
          >
            <span style={{ color: 'var(--on-brand, #fff)', fontWeight: 700 }}>A</span>
          </div>
          <span style={{ color: 'var(--text)', fontWeight: 700 }}>AuraPal</span>
        </div>

        {/* Footer nav */}
        <nav className="flex flex-wrap gap-4 text-sm" aria-label="Footer">
          <Link to="/about" style={{ color: 'var(--muted)' }} className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-start)]">
            About
          </Link>
          <Link to="/privacy" style={{ color: 'var(--muted)' }} className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-start)]">
            Privacy
          </Link>
          <Link to="/terms" style={{ color: 'var(--muted)' }} className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-start)]">
            Terms
          </Link>
          <Link to="/contact" style={{ color: 'var(--muted)' }} className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-start)]">
            Contact
          </Link>
        </nav>

        {/* Legal */}
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          © {new Date().getFullYear()} AuraPal. All rights reserved.
        </div>
      </div>
    </footer>
  )
}