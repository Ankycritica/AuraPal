import React, { useEffect, useRef, useState, useCallback } from 'react'
import Onboarding from '../../components/Onboarding'
import { useGuest } from '../../hooks/useGuest'
import socketApi from '../../api/socket'
import StartChat from '../../components/StartChat'
import SearchOverlay from '../../components/SearchOverlay'
import ChatRoom from '../../components/ChatRoom'
import FriendRequest from '../../components/FriendRequest'
import { useToast } from '../../contexts/ToastContext'

export default function ChatPage() {
  const { guest, startAsGuest, isOnboarded, setOnboarded } = useGuest()
  const { toast } = useToast()

  const [user, setUser] = useState(null)
  const [state, setState] = useState('idle') // idle, searching, connected, friendRequest
  const [peer, setPeer] = useState(null)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [currentFriendRequest, setCurrentFriendRequest] = useState(null)

  const socketRef = useRef(null)
  const listenersAttached = useRef(false)

  // -----------------------------
  // AUTH CHECK (SAFE FALLBACK)
  // -----------------------------
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data?.user) {
          setUser(data.user)
          toast({
            title: 'Welcome back!',
            description: `Logged in as ${data.user.displayName || data.user.email}`,
            variant: 'success'
          })
        }
      })
      .catch(() => {})
  }, [toast])

  // -----------------------------
  // ENSURE GUEST EXISTS BEFORE SOCKET
  // -----------------------------
  useEffect(() => {
    if (!isOnboarded) return
    if (!guest) startAsGuest()
  }, [isOnboarded, guest, startAsGuest])

  // -----------------------------
  // SINGLE SOCKET CONNECTION
  // -----------------------------
  useEffect(() => {
    if (!isOnboarded || !guest) return
    if (socketRef.current) return // prevent reconnects

    const s = socketApi.connect(guest)
    socketRef.current = s

    return () => {
      socketApi.disconnect()
      socketRef.current = null
      listenersAttached.current = false
    }
  }, [isOnboarded, guest])

  // -----------------------------
  // ATTACH SOCKET LISTENERS ONCE
  // -----------------------------
  useEffect(() => {
    if (!socketRef.current || listenersAttached.current) return
    listenersAttached.current = true

    socketApi.on('paired', ({ peerId, peerMeta, age, gender, country, guestName }) => {
      setPeer({ id: peerId, meta: peerMeta, age, gender, country, guestName })
      setMessages([{ id: `sys_${Date.now()}`, system: true, text: 'Paired with stranger' }])
      setState('connected')
    })

    socketApi.on('unpaired', () => {
      setPeer(null)
      setMessages(m => [...m, { id: `sys_${Date.now()}`, system: true, text: 'Unpaired' }])
      setState('idle')
    })

    socketApi.on('chat_message', msg => {
      setMessages(m => [...m, { ...msg, status: 'delivered' }])
    })

    socketApi.on('typing', () => setTyping(true))
    socketApi.on('stop_typing', () => setTyping(false))

    socketApi.on('delivered', ({ messageId }) => {
      setMessages(m => m.map(it => it.id === messageId ? { ...it, status: 'delivered' } : it))
    })

    socketApi.on('seen', ({ messageId }) => {
      setMessages(m => m.map(it => it.id === messageId ? { ...it, status: 'seen' } : it))
    })

    socketApi.on('friend_request', req => {
      setCurrentFriendRequest(req)
      setState('friendRequest')
    })

    socketApi.on('friend_added', friend => {
      setMessages(m => [...m, { id: `sys_${Date.now()}`, system: true, text: `You are now friends with ${friend.name || friend.id}` }])
      setState('connected')
    })

    socketApi.on('friend_declined', () => {
      setMessages(m => [...m, { id: `sys_${Date.now()}`, system: true, text: 'Friend request declined' }])
      setState('connected')
    })
  }, [])

  // -----------------------------
  // SEND MESSAGE
  // -----------------------------
  const send = useCallback((text) => {
    if (!text.trim()) return
    const id = `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    const payload = { id, text, from: guest?.id }

    setMessages(m => [...m, { ...payload, status: 'pending', timestamp: new Date().toISOString() }])

    socketApi.sendMessage(payload, ack => {
      setMessages(m =>
        m.map(it => it.id === id ? { ...it, status: ack?.ok ? 'delivered' : 'failed' } : it)
      )
    })
  }, [guest])

  // -----------------------------
  // ACTIONS
  // -----------------------------
  const handleStart = () => {
    setState('searching')
    socketApi.findRandom()
  }

  const handleNext = () => {
    setState('searching')
    socketApi.skipRandom()
    socketApi.findRandom()
  }

  const handleExit = () => {
    setState('idle')
    socketApi.stopRandom()
    setPeer(null)
    setMessages([])
  }

  const handleAddFriend = () => {
    if (!peer) return
    socketApi.sendFriendRequest(peer.id, { name: guest?.name, avatarEmoji: guest?.avatarEmoji })
    setMessages(m => [...m, { id: `sys_${Date.now()}`, system: true, text: 'Friend request sent' }])
  }

  const acceptRequest = req => {
    socketApi.respondFriendRequest(req.id, true)
    setCurrentFriendRequest(null)
    setState('connected')
  }

  const declineRequest = req => {
    socketApi.respondFriendRequest(req.id, false)
    setCurrentFriendRequest(null)
    setState('connected')
  }

  const emitTyping = () => socketRef.current?.emit?.('typing')
  const emitStopTyping = () => socketRef.current?.emit?.('stop_typing')

  // -----------------------------
  // RENDER
  // -----------------------------
  if (!isOnboarded) {
    return <Onboarding onComplete={() => setOnboarded(true)} />
  }

  return (
    <div className="min-h-screen">
      {state === 'idle' && <StartChat onStart={handleStart} />}
      {state === 'searching' && <SearchOverlay />}
      {(state === 'connected' || state === 'friendRequest') && (
        <>
          <ChatRoom
            peer={peer}
            messages={messages}
            typing={typing}
            guestId={guest?.id}
            onSend={send}
            onSkip={handleNext}
            onExit={handleExit}
            onAddFriend={handleAddFriend}
            onTypingStart={emitTyping}
            onTypingStop={emitStopTyping}
          />
          {state === 'friendRequest' && (
            <FriendRequest
              request={currentFriendRequest}
              onAccept={acceptRequest}
              onDecline={declineRequest}
              isOpen={true}
            />
          )}
        </>
      )}
    </div>
  )
}
