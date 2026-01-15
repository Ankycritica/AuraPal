// src/pages/Messages.jsx
import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { MessageList } from '../components/MessageList'
import { MessageThread } from '../components/MessageThread'
import { Composer } from '../components/Composer'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { useMessageStore } from '../store/useStore'
import { ArrowLeft, Lock, AlertCircle, MoreVertical } from 'lucide-react'
import { ReportModal } from '../components/ReportModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import { useToast } from '../components/ui/Toast'

export function Messages() {
  const { conversationId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const {
    conversations,
    setCurrentConversation,
    blockUser,
    unblockUser,
    simulateIncomingMessage,
  } = useMessageStore()

  const [showReportModal, setShowReportModal] = useState(false)
  const { push } = useToast()

  const conversation = conversationId
    ? conversations.find((c) => c.id === conversationId)
    : null

  // Keep store in sync with route: set current conversation when route has an id
  useEffect(() => {
    if (conversationId) {
      setCurrentConversation(conversationId)
    } else {
      setCurrentConversation(null)
    }
    return () => {
      setCurrentConversation(null)
    }
  }, [conversationId, setCurrentConversation])

  // If no conversationId in the URL, auto-open the first conversation (if any)
  useEffect(() => {
    if (!conversationId && conversations && conversations.length > 0) {
      const first = conversations[0]
      if (first && first.id) {
        navigate(`/messages/${first.id}`, { replace: true })
      }
    }
  }, [conversationId, conversations, navigate])

  // Handle starting a new conversation from URL params (e.g., /messages?user=123)
  useEffect(() => {
    const userId = searchParams.get('user')
    if (userId && !conversationId) {
      const existing = conversations.find((c) => c.participantId === userId)
      if (existing) {
        navigate(`/messages/${existing.id}`, { replace: true })
      } else {
        console.log('No existing conversation found for user:', userId)
        navigate('/messages', { replace: true })
      }
    }
  }, [searchParams, conversationId, conversations, navigate])

  // If route contains an id but we couldn't find the conversation, redirect to messages list
  useEffect(() => {
    if (conversationId && !conversation) {
      navigate('/messages', { replace: true })
    }
  }, [conversationId, conversation, navigate])

  // Render thread view when a conversation is selected and exists
  if (conversationId && conversation) {
    return (
      <div className="flex h-[calc(100vh-200px)] flex-col">
        {/* Header */}
        <div
          className="border-b p-4"
          style={{ background: 'var(--surface)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text)' }}
                >
                  <span className="text-lg font-semibold">{conversation.participantName[0]}</span>
                </div>

                <div>
                  <h2 className="font-semibold" style={{ color: 'var(--text)' }}>
                    {conversation.participantName}
                  </h2>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                    <Lock className="h-3 w-3" />
                    <span>End-to-end encrypted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowReportModal(true)}>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Report User
                </DropdownMenuItem>

                {conversation.isBlocked ? (
                  <DropdownMenuItem
                    onClick={() => {
                      unblockUser(conversation.participantId)
                      push?.({
                        title: 'User unblocked',
                        description: `${conversation.participantName} has been unblocked.`,
                        duration: 3000,
                      })
                    }}
                  >
                    Unblock
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => {
                      blockUser(conversation.participantId)
                      push?.({
                        title: 'User blocked',
                        description: `${conversation.participantName} has been blocked.`,
                        duration: 3000,
                      })
                    }}
                  >
                    Block
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => simulateIncomingMessage(conversationId)}
                  className="text-xs"
                  style={{ color: 'var(--muted)' }}
                >
                  (Dev) Simulate Message
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Thread */}
        <div className="flex-1 overflow-hidden">
          <MessageThread conversationId={conversationId} />
        </div>

        {/* Composer */}
        <Composer conversationId={conversationId} />

        {/* Report Modal */}
        <ReportModal
          open={showReportModal}
          onOpenChange={setShowReportModal}
          userId={conversation.participantId}
          userName={conversation.participantName}
        />
      </div>
    )
  }

  // Fallback: No conversation selected (or we redirected to list)
  return (
    <div className="py-8 px-4 sm:py-12" style={{ background: 'var(--surface)' }}>
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold" style={{ color: 'var(--text)' }}>
          Messages
        </h1>

        <Card className="h-[600px]">
          <CardContent className="h-full p-0">
            <MessageList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}