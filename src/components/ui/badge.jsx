import * as React from 'react'
import { cn } from '../../lib/utils'

export const Badge = ({ children, variant = 'default', className, ...props }) => {
  let styles = {}

  switch (variant) {
    case 'gradient':
      styles = {
        background: 'var(--brand-gradient)',
        color: '#fff',
      }
      break
    case 'muted':
      styles = {
        background: 'rgba(255,255,255,0.06)',
        color: 'var(--muted)',
      }
      break
    default:
      styles = {
        background: 'var(--surface)',
        color: 'var(--text)',
        border: '1px solid rgba(255,255,255,0.06)',
      }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        className
      )}
      style={styles}
      {...props}
    >
      {children}
    </span>
  )
}