import * as React from 'react'
import { cn } from '../../lib/utils'

const Input = React.forwardRef(({ className, type, style, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      style={{
        background: 'var(--surface)',
        color: 'var(--text)',
        borderColor: 'rgba(255,255,255,0.06)',
        placeholderColor: 'var(--muted)',
        ...(style || {}),
      }}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }