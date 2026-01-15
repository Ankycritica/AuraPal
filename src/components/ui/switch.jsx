import * as React from 'react'
import { cn } from '../../lib/utils'

export const Switch = ({ checked, onChange, className, ...props }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        className
      )}
      style={{
        background: checked ? 'var(--brand-gradient)' : 'var(--surface)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      {...props}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        style={{
          transform: checked ? 'translateX(1.25rem)' : 'translateX(0.25rem)',
        }}
      />
    </button>
  )
}