// src/components/ui/card.jsx
import * as React from 'react'
import { cn } from '../../lib/utils'

const Card = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('rounded-lg border shadow-sm', className)}
    style={{
      background: 'var(--card-bg, var(--surface))',
      color: 'var(--text)',
      borderColor: 'rgba(255,255,255,0.04)',
      ...(style || {}),
    }}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    style={{ ...(style || {}) }}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef(({ className, style, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    style={{ color: 'var(--text)', lineHeight: 1.2, ...(style || {}) }}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef(({ className, style, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm', className)}
    style={{ color: 'var(--muted)', ...(style || {}) }}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-0', className)}
    style={{ ...(style || {}) }}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    style={{ ...(style || {}) }}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }