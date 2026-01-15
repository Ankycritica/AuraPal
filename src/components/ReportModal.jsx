// src/components/ReportModal.jsx
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { useMessageStore } from '../store/useStore'

export function ReportModal({ open, onOpenChange, userId, userName }) {
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const { reportUser } = useMessageStore()

  const handleSubmit = () => {
    if (!reason) return
    reportUser(userId, reason, note)
    setReason('')
    setNote('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          background: 'var(--surface)',
          color: 'var(--text)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--text)' }}>
            Report {userName}
          </DialogTitle>
          <DialogDescription style={{ color: 'var(--muted)' }}>
            Help us keep AuraPal safe. Your report will be reviewed by our moderation team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Reason Select */}
          <div>
            <Label htmlFor="reason">Reason for reporting</Label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-start)]"
              style={{
                background: 'var(--surface)',
                color: 'var(--text)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <option value="">Select a reason</option>
              <option value="harassment">Harassment or bullying</option>
              <option value="spam">Spam or scams</option>
              <option value="inappropriate">Inappropriate content</option>
              <option value="fake">Fake profile</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Note Input */}
          <div>
            <Label htmlFor="note">Additional details (optional)</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Provide any additional context..."
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reason}
            style={{
              background: 'var(--brand-gradient)',
              color: 'var(--on-brand, #fff)',
            }}
          >
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}