// src/components/ThemeToggle.jsx
import { useEffect, useState } from 'react'
import { Toggle } from './ui/toggle'

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // Persist user preference
    const saved = localStorage.getItem('ap-theme')
    return saved === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ap-theme', theme)
  }, [theme])

  const checked = theme === 'light'

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm" style={{ color: 'var(--muted)' }}>
        {checked ? 'Light' : 'Dark'}
      </span>
      <Toggle
        checked={checked}
        onCheckedChange={(isLight) => setTheme(isLight ? 'light' : 'dark')}
        size="md"
        ariaLabel="Theme toggle"
      />
    </div>
  )
}