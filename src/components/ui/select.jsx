import * as React from 'react'
import { cn } from '../../lib/utils'

export const Select = React.forwardRef(({ options = [], value, onChange, className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      value={value}
      onChange={onChange}
      className={cn(
        'flex h-10 w-full rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      style={{
        background: 'var(--surface)',
        color: 'var(--text)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} style={{ background: 'var(--surface)', color: 'var(--text)' }}>
          {opt.label}
        </option>
      ))}
    </select>
  )
})
Select.displayName = 'Select'