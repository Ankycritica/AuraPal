// src/components/ui/toggle.jsx
import React from 'react'

/**
 * Toggle
 * Props:
 * - checked (boolean)
 * - onCheckedChange (fn)
 * - size: 'sm' | 'md' | 'lg'
 * - disabled (boolean)
 */
export function Toggle({
  checked = false,
  onCheckedChange = () => {},
  size = 'md',
  disabled = false,
  ariaLabel = 'Toggle',
}) {
  const sizes = {
    sm: { w: 2.0, h: 1.0, knob: 0.75 }, // rem units
    md: { w: 2.5, h: 1.25, knob: 1.0 },
    lg: { w: 3.0, h: 1.5, knob: 1.25 },
  }
  const s = sizes[size] || sizes.md

  return (
    <button
      type="button"
      role="switch"
      aria-label={ariaLabel}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className="inline-flex items-center rounded-full transition-colors focus:outline-none"
      style={{
        width: `${s.w}rem`,
        height: `${s.h}rem`,
        padding: '0.125rem',
        background: checked
          // FIX: use the gradient variable directly (do not nest gradients)
          ? 'var(--brand-gradient)'
          : 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border)',
      }}
    >
      <span
        aria-hidden
        className="rounded-full shadow-sm transition-transform"
        style={{
          display: 'block',
          width: `${s.knob}rem`,
          height: `${s.knob}rem`,
          background: checked ? 'var(--on-brand)' : 'var(--surface)',
          transform: checked ? `translateX(${s.w - s.knob - 0.25}rem)` : 'translateX(0)',
        }}
      />
    </button>
  )
}