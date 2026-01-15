// src/components/MatchCard.jsx
import { Card, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { Heart, MessageSquare } from 'lucide-react'
import { useMatchStore } from '../store/useStore'
import { Avatar } from './ui/avatar'

export function MatchCard({ match }) {
  const { allUsers } = useMatchStore()
  const user = allUsers.find((u) => u.id === match.userId)

  if (!user) return null

  const matchPercentage = Math.round(match.score * 100)

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <Avatar
              src={user.avatar}
              alt={user.displayName}
              initials={user.displayName?.[0]}
              size={48}
            />
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--text)' }}>
                {user.displayName}
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {user.handle}
              </p>
            </div>
          </div>

          {/* Match Percentage */}
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1"
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--brand-start)',
            }}
          >
            <Heart className="h-4 w-4" />
            <span className="text-sm font-semibold" style={{ color: 'var(--brand-start)' }}>
              {matchPercentage}%
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Match Reason */}
        <p className="mb-3 text-sm" style={{ color: 'var(--muted)' }}>
          {match.reason}
        </p>

        {/* Mutual Interests */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium" style={{ color: 'var(--muted)' }}>
            Mutual Interests:
          </p>
          <div className="flex flex-wrap gap-2">
            {match.mutualInterests.map((interest) => (
              <span
                key={interest}
                className="rounded-full px-2 py-1 text-xs font-medium"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'var(--brand-start)',
                }}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Start Conversation Button */}
        <Button
          asChild
          className="w-full"
          size="sm"
          style={{
            background: 'var(--brand-gradient)',
            color: 'var(--on-brand, #fff)',
          }}
        >
          <Link to={`/messages?user=${user.id}`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Start Conversation
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}