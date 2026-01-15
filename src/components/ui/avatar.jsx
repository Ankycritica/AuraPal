// src/components/ui/avatar.jsx
import * as React from 'react'
import { cn } from '../../lib/utils'

export function Avatar({ src, alt, initials, size = 40, className }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border overflow-hidden select-none',
        className
      )}
      style={{
        height: size,
        width: size,
        background: src ? 'transparent' : 'var(--surface)',
        borderColor: 'var(--brand-start)',
        color: 'var(--text)',
        fontSize: size < 40 ? '0.75rem' : '0.875rem',
        fontWeight: 600,
        lineHeight: 1,
      }}
      aria-label={alt || initials || 'avatar'}
    >
      {src ? (
        <img
          src={src}
          alt={alt || 'avatar'}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  )
}