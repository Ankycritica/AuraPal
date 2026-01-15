import { Card, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { MoreVertical, Shield, ShieldOff } from 'lucide-react'
import { useState } from 'react'
import { ReportModal } from './ReportModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function ProfileCard({ user, onBlock, onUnblock, isBlocked }) {
  const [showReportModal, setShowReportModal] = useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.displayName} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span className="text-xl font-semibold">{user.displayName[0]}</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.displayName}</h3>
                <p className="text-sm text-muted-foreground">{user.handle}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowReportModal(true)}>Report</DropdownMenuItem>
                {isBlocked ? (
                  <DropdownMenuItem onClick={() => onUnblock(user.id)}>Unblock</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onBlock(user.id)}>Block</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm">{user.bio || 'No bio yet.'}</p>
          <div className="flex flex-wrap gap-2">
            {user.interests?.map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-primary-100 px-3 py-1 text-xs text-primary-700"
              >
                {interest}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            {user.visibility === 'public' ? (
              <>
                <Shield className="h-4 w-4" />
                <span>Public profile</span>
              </>
            ) : (
              <>
                <ShieldOff className="h-4 w-4" />
                <span>Private profile</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <ReportModal
        open={showReportModal}
        onOpenChange={setShowReportModal}
        userId={user.id}
        userName={user.displayName}
      />
    </>
  )
}

