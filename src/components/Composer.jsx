// src/components/Composer.jsx
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Send, Paperclip, Lock } from 'lucide-react'
import { useMessageStore } from '../store/useStore'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

export function Composer({ conversationId }) {
  const [text, setText] = useState('')
  const { sendMessage } = useMessageStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim() || !conversationId) return
    sendMessage(conversationId, text.trim())
    setText('')
  }

  return (
    <div
      className="border-t p-4"
      style={{
        background: 'var(--surface)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      {/* Encryption Notice */}
      <div className="mb-2 flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>Messages are end-to-end encrypted</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs" style={{ color: 'var(--muted)' }}>
                Messages are end-to-end encrypted (mocked in this demo). TODO: Integrate with real
                encryption service.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Composer Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Attach File Button (disabled for now) */}
        <Button type="button" variant="ghost" size="icon" disabled>
          <Paperclip className="h-4 w-4" />
          <span className="sr-only">Attach file</span>
        </Button>

        {/* Message Input */}
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          style={{
            background: 'var(--surface)',
            color: 'var(--text)',
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        />

        {/* Send Button */}
        <Button
          type="submit"
          size="icon"
          disabled={!text.trim()}
          style={{
            background: 'var(--brand-gradient)',
            color: 'var(--on-brand, #fff)',
          }}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  )
}