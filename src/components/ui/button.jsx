// src/components/ui/button.jsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { buttonVariants } from './button-variants'
import { cn } from '../../lib/utils'

const Button = React.forwardRef(function Button(
  { className, variant = 'default', size = 'default', asChild = false, style: userStyle, ...props },
  ref
) {
  const Comp = asChild ? Slot : 'button'

  // Tokenized inline overrides
  const variantStyle =
    variant === 'default'
      ? {
          background: 'var(--btn-primary-bg, linear-gradient(90deg, var(--brand-start), var(--brand-gradient)))',
          color: 'var(--btn-primary-text, var(--on-brand, #fff))',
        }
      : variant === 'outline'
      ? {
          borderColor: 'var(--btn-outline-border, var(--brand-start))',
          color: 'var(--btn-outline-text, var(--text))',
          background: 'transparent',
        }
      : variant === 'ghost'
      ? {
          background: 'transparent',
          color: 'var(--btn-ghost-text, var(--muted))',
        }
      : variant === 'link'
      ? {
          color: 'var(--btn-link-text, var(--brand-start))',
          background: 'transparent',
        }
      : variant === 'destructive'
      ? {
          background: 'var(--destructive)',
          color: 'var(--destructive-foreground)',
        }
      : {}

  const mergedStyle = { ...variantStyle, ...(userStyle || {}) }

  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      style={mergedStyle}
      {...props}
    />
  )
})

Button.displayName = 'Button'

export { Button }