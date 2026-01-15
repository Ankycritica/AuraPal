import React from 'react'

export function GuestBadge({ identity, size = 40 }) {
  const emoji = identity?.avatarEmoji || '🙂'
  const name = identity?.name || 'Guest'
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: size, height: size, background: 'var(--brand-gradient)', color: 'var(--on-brand)' }}
        aria-hidden
      >
        <span style={{ fontSize: Math.floor(size / 2) }}>{emoji}</span>
      </div>
      <div>
        <div style={{ color: 'var(--text)', fontWeight: 600 }}>{name}</div>
      </div>
    </div>
  )
}

export default GuestBadge
