// src/pages/Dashboard.jsx
import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Button } from '../components/ui/button'
import { MatchCard } from '../components/MatchCard'
import { useAuthStore, useMatchStore } from '../store/useStore'
import { MessageSquare, User, Settings } from 'lucide-react'

export function Dashboard() {
  const { user } = useAuthStore()
  const { suggestedMatches } = useMatchStore()

  return (
    <div className="py-8 px-4 sm:py-12" style={{ background: 'var(--surface)' }}>
      <div className="mx-auto max-w-7xl">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
            Welcome back, {user?.displayName || 'there'}!
          </h1>
          <p className="mt-2" style={{ color: 'var(--muted)' }}>
            Here's what's happening on AuraPal today.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">

            {/* Suggested Connections — ONLY show if real matches exist */}
            {suggestedMatches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle style={{ color: 'var(--text)' }}>
                    Suggested Connections
                  </CardTitle>
                  <CardDescription style={{ color: 'var(--muted)' }}>
                    People who share your interests and values
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {suggestedMatches.map((match, index) => (
                      <MatchCard key={match.userId || index} match={match} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle style={{ color: 'var(--text)' }}>
                  Recent Activity
                </CardTitle>
                <CardDescription style={{ color: 'var(--muted)' }}>
                  Your latest connections and messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8" style={{ color: 'var(--muted)' }}>
                  No recent activity. Start connecting with people!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle style={{ color: 'var(--text)' }}>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild className="w-full" variant="outline">
                  <Link to="/messages">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </Link>
                </Button>

                <Button asChild className="w-full" variant="outline">
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>

                <Button asChild className="w-full" variant="outline">
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Guest Mode */}
            {user?.isGuest && (
              <Card
                style={{
                  borderColor: 'rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                <CardHeader>
                  <CardTitle className="text-sm" style={{ color: 'var(--text)' }}>
                    Guest Mode
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
                    You're browsing as a guest. Sign up to save your profile and
                    connect with others.
                  </p>

                  <Button
                    asChild
                    size="sm"
                    className="w-full"
                    style={{
                      background: 'var(--brand-gradient)',
                      color: 'var(--on-brand, #fff)',
                    }}
                  >
                    <Link to="/signup">Create Account</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
