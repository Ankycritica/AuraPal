// src/components/ui/use-toast.jsx
import React, {
  useCallback,
  useState,
  useEffect,
} from "react"

import { ToastContext } from './toast-context'

/**
 * ToastProvider
 * - manages a list of toasts
 * - exposes push and remove
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    const t = {
      id,
      title: toast.title || "",
      description: toast.description || "",
      variant: toast.variant || "default", // default | success | error | info
      duration: typeof toast.duration === "number" ? toast.duration : 4000,
    }
    setToasts((s) => [...s, t])
    return id
  }, [])

  const remove = useCallback((id) => {
    setToasts((s) => s.filter((x) => x.id !== id))
  }, [])

  // auto-remove toasts after duration
  useEffect(() => {
    const timers = toasts.map((t) => {
      if (t.duration === 0) return null
      return setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== t.id))
      }, t.duration)
    })
    return () => timers.forEach((tm) => tm && clearTimeout(tm))
  }, [toasts])

  const value = { push, remove, toasts }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  )
}

/* --- Toast UI --- */
function ToastViewport({ toasts, onRemove }) {
  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => onRemove(t.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose }) {
  const { title, description, variant } = toast
  return (
    <div
      role="status"
      className={`toast-item toast-${variant}`}
      tabIndex={0}
    >
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        {description && <div className="toast-desc">{description}</div>}
      </div>
      <button
        className="toast-close"
        aria-label="Dismiss notification"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  )
}

export default ToastProvider
