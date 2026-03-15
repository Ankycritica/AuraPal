import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastProvider } from './components/ui/use-toast'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Features } from './pages/Features'
import { Pricing } from './pages/Pricing'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { Dashboard } from './pages/Dashboard'
import { Profile } from './pages/Profile'
import { Messages } from './pages/Messages'
import { Safety } from './pages/Safety'
import Chat from './pages/Chat'
import { NotFound } from './pages/NotFound'
import ChatTest from './pages/ChatTest'
import { Settings } from './pages/Settings'
import { PremiumCheckout } from './pages/PremiumCheckout'
import FriendRequestListener from './components/FriendRequestListener'

function App() {
  useEffect(() => {
    document.body.style.background = '#09090b'
    document.body.style.color = '#fafafa'
  }, [])

  return (
    <ToastProvider>
      <BrowserRouter>
        <FriendRequestListener />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/omegle-alternative" element={<Home />} />
            <Route path="/random-chat" element={<Home />} />
            <Route path="/chat-with-strangers" element={<Home />} />
            <Route path="/anonymous-chat" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/safety" element={<Safety />} />

            {/* Chat system entry - NO PROTECTION, user can enter anytime */}
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat-test" element={<ChatTest />} />

            {/* Auth */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/checkout" element={<PremiumCheckout />} />

            {/* Protected pages */}
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
