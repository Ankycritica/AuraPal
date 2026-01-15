// src/components/ui/Toast.jsx
import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((toast) => {
    const id = `toast-${Date.now()}`
    setToasts((t) => [...t, { id, ...toast }])
    if (toast.duration !== 0) {
      const duration = toast.duration || 4000
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id))
      }, duration)
    }
    return id
  }, [])

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 60,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => {
          // pick border color based on variant
          let borderColor = 'rgba(255,255,255,0.06)'
          if (t.variant === 'success') borderColor = '#10b981' // green
          if (t.variant === 'error') borderColor = '#ef4444'   // red
          if (t.variant === 'info') borderColor = '#06b6d4'    // cyan

          return (
            <div
              key={t.id}
              role="status"
              style={{
                pointerEvents: 'auto',
                minWidth: 240,
                maxWidth: 360,
                background: 'var(--surface)',
                color: 'var(--text)',
                border: `2px solid ${borderColor}`,
                padding: '0.75rem 1rem',
                borderRadius: 8,
                boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{t.title}</div>
                {t.description && (
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{t.description}</div>
                )}
              </div>
              <button
                onClick={() => remove(t.id)}
                aria-label="Dismiss"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  padding: 6,
                }}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}