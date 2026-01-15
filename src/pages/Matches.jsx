// src/pages/Matches.jsx
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Avatar } from '../components/ui/avatar'
import { useMatchStore } from '../store/useStore'
import { useNavigate } from 'react-router-dom'

export function Matches() {
  const { suggestedMatches } = useMatchStore()
  const navigate = useNavigate()

  if (!suggestedMatches || suggestedMatches.length === 0) {
    return (
      <div className="py-8 px-4 sm:py-12" style={{ background: 'var(--surface)' }}>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-3xl font-bold" style={{ color: 'var(--text)' }}>
            Matches
          </h1>
          <p style={{ color: 'var(--muted)' }}>
            No suggested matches yet. Try updating your interests in your profile to see more.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 sm:py-12" style={{ background: 'var(--surface)' }}>
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold" style={{ color: 'var(--text)' }}>
          Suggested Matches
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {suggestedMatches.map((match) => (
            <Card key={match.id}>
              <CardHeader className="flex flex-col items-center">
                <Avatar
                  src={match.avatar}
                  alt={match.displayName}
                  initials={match.displayName?.slice(0, 2)}
                  size={64}
                />
                <CardTitle className="mt-3 text-lg" style={{ color: 'var(--text)' }}>
                  {match.displayName}
                </CardTitle>
                <p style={{ color: 'var(--muted)' }}>{match.handle}</p>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
                  {match.bio || 'No bio provided'}
                </p>
                <Button
                  style={{ background: 'var(--brand-gradient)', color: '#fff' }}
                  onClick={() => navigate(`/messages?user=${match.id}`)}
                >
                  Message
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}