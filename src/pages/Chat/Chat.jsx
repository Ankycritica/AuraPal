import React, { useEffect, useRef, useState, useCallback } from 'react'
import { AnonymousOnboarding } from '../../components/AnonymousOnboarding'
import { useGuest } from '../../hooks/useGuest'
import socketApi from '../../api/socket'
import StartChat from '../../components/StartChat'
import SearchOverlay from '../../components/SearchOverlay'
import ChatRoom from '../../components/ChatRoom'
import FriendRequest from '../../components/FriendRequest'

export default function ChatPage() {
  const { guest, startAsGuest, isOnboarded, setOnboarded } = useGuest()
  const [state, setState] = useState('idle') // 'idle', 'searching', 'connected', 'friendRequest'
  const [connected, setConnected] = useState(false)
  const [peer, setPeer] = useState(null)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [pendingRequests, setPendingRequests] = useState([])
  const [currentFriendRequest, setCurrentFriendRequest] = useState(null)

  const socketRef = useRef(null)

  const isAuthenticated = !!localStorage.getItem('ap-auth-demo')

  useEffect(() => {
    if (!isOnboarded || state === 'idle') return
    if (!guest) startAsGuest()

    const s = socketApi.connect(guest || undefined)
    socketRef.current = s
    setConnected(!!s && s.connected)

    const offConnect = socketApi.on('connect', () => setConnected(true))
    const offDisconnect = socketApi.on('disconnect', () => setConnected(false))

    const offPaired = socketApi.on('paired', ({ peerId, peerMeta }) => {
      setPeer({ id: peerId, meta: peerMeta })
      setMessages([])
      setState('connected')
      setMessages((m) => [...m, { id: `sys_${Date.now()}`, system: true, text: 'Paired with stranger' }])
    })

    const offUnpaired = socketApi.on('unpaired', () => {
      setPeer(null)
      setMessages((m) => [...m, { id: `sys_${Date.now()}`, system: true, text: 'Unpaired' }])
      setState('idle')
    })

    const offChat = socketApi.on('chat_message', (msg) => {
      setMessages((m) => [...m, { ...msg, status: 'delivered' }])
    })

    const offTyping = socketApi.on('typing', () => setTyping(true))
    const offStopTyping = socketApi.on('stop_typing', () => setTyping(false))

    const offDelivered = socketApi.on('delivered', ({ messageId }) => {
      setMessages((m) => m.map(it => it.id === messageId ? { ...it, status: 'delivered' } : it))
    })

    const offSeen = socketApi.on('seen', ({ messageId }) => {
      setMessages((m) => m.map(it => it.id === messageId ? { ...it, status: 'seen' } : it))
    })

    const offFriendRequest = socketApi.on('friend_request', (req) => {
      setCurrentFriendRequest(req)
      setState('friendRequest')
    })

    const offFriendAdded = socketApi.on('friend_added', (friend) => {
      setMessages((m) => [...m, { id: `sys_${Date.now()}`, system: true, text: `You are now friends with ${friend.name || friend.id}` }])
      setState('connected')
    })

    const offFriendDeclined = socketApi.on('friend_declined', () => {
      setMessages((m) => [...m, { id: `sys_${Date.now()}`, system: true, text: 'Friend request declined' }])
      setState('connected')
    })

    return () => {
      offConnect && offConnect()
      offDisconnect && offDisconnect()
      offPaired && offPaired()
      offUnpaired && offUnpaired()
      offChat && offChat()
      offTyping && offTyping()
      offStopTyping && offStopTyping()
      offDelivered && offDelivered()
      offSeen && offSeen()
      offFriendRequest && offFriendRequest()
      offFriendAdded && offFriendAdded()
      offFriendDeclined && offFriendDeclined()
      socketApi.disconnect()
      socketRef.current = null
    }
  }, [isOnboarded, guest, startAsGuest, state])

  const send = useCallback((text) => {
    if (!text || !text.trim()) return
    const id = `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    const payload = { id, text, from: guest?.id }
    setMessages((m) => [...m, { ...payload, status: 'pending', timestamp: new Date().toISOString() }])
    socketApi.sendMessage(payload, (ack) => {
      if (ack && ack.ok) {
        setMessages((m) => m.map(it => it.id === id ? { ...it, status: 'delivered' } : it))
      } else {
        setMessages((m) => m.map(it => it.id === id ? { ...it, status: 'failed' } : it))
      }
    })
  }, [guest])

  const handleStart = () => {
    setState('searching')
    socketApi.findRandom()
  }

  function handleNext() {
    setState('searching')
    socketApi.skipRandom()
    socketApi.findRandom()
  }

  function handleExit() {
    setState('idle')
    socketApi.stopRandom()
    setPeer(null)
    setMessages([])
  }

  function handleAddFriend() {
    if (!peer) return
    socketApi.sendFriendRequest(peer.id, { name: guest?.name, avatarEmoji: guest?.avatarEmoji })
    setMessages((m) => [...m, { id: `sys_${Date.now()}`, system: true, text: 'Friend request sent' }])
  }

  function acceptRequest(req) {
    socketApi.respondFriendRequest(req.id, true)
    setCurrentFriendRequest(null)
    setState('connected')
  }

  function declineRequest(req) {
    socketApi.respondFriendRequest(req.id, false)
    setCurrentFriendRequest(null)
    setState('connected')
  }

  const emitTyping = useCallback(() => { socketRef.current?.emit && socketRef.current.emit('typing') }, [])
  const emitStopTyping = useCallback(() => { socketRef.current?.emit && socketRef.current.emit('stop_typing') }, [])

  if (!isOnboarded) {
    return <AnonymousOnboarding onComplete={() => setOnboarded(true)} />
  }

  return (
    <div className="min-h-screen">
      {state === 'idle' && <StartChat onStart={handleStart} />}
      {state === 'searching' && <SearchOverlay />}
      {state === 'connected' && (
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
      )}
      {state === 'friendRequest' && (
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
          <FriendRequest
            request={currentFriendRequest}
            onAccept={acceptRequest}
            onDecline={declineRequest}
            isOpen={true}
          />
        </>
      )}
    </div>
  )
}
