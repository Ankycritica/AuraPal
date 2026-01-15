// Ensure App.jsx wraps everything in <ToastProvider>
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastProvider } from './components/ui/Toast'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Features } from './pages/Features'
import { Pricing } from './pages/Pricing'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { Onboarding } from './pages/Onboarding'
import { Dashboard } from './pages/Dashboard'
import { Profile } from './pages/Profile'
import { Messages } from './pages/Messages'
import { Safety } from './pages/Safety'
import Chat from './pages/Chat'
import { NotFound } from './pages/NotFound'
import ChatTest from './pages/ChatTest'
import { Settings } from './pages/Settings'

function App() {
  // Apply site-wide color tokens that match the ChitChat-style palette.
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--brand-start', '#6d28d9') // purple
    root.style.setProperty('--brand-end', '#06b6d4') // cyan
    root.style.setProperty(
      '--brand-gradient',
      'linear-gradient(90deg,var(--brand-start),var(--brand-end))'
    )
    root.style.setProperty('--accent', '#7dd3fc') // light cyan accent
    root.style.setProperty('--bg-dark', '#071026') // deep background
    root.style.setProperty('--surface', '#0b1220') // card / surface
    root.style.setProperty('--muted', '#9aa6c7') // muted text
    root.style.setProperty('--text', '#e6eef9') // primary text
    root.style.setProperty('--link', '#9be7ff') // link color

    document.body.style.background = 'var(--bg-dark)'
    document.body.style.color = 'var(--text)'
  }, [])

  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat-test" element={<ChatTest />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/safety" element={<Safety />} />

            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />

            <Route
              path="/messages/:conversationId"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App