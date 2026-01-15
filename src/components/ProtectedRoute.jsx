// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useStore'

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    // Preserve the attempted location so SignIn can redirect back after successful login
    return <Navigate to="/signin" replace state={{ from: location }} />
  }

  return children
}