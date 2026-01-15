import React, { useEffect, useRef, useState, useCallback } from 'react'
import { AnonymousOnboarding } from '../../components/AnonymousOnboarding'
import { useGuest } from '../../hooks/useGuest'
import socketApi from '../../api/socket'
import ChatSidebar from './Sidebar/ChatSidebar'
import ChatHeader from './Header/ChatHeader'
import MessageList from './Messages/MessageList'
import ChatComposer from './Composer/ChatComposer'
import FriendRequestsPanel from './Friends/FriendRequestsPanel'

export default function ChatPage() {
  const { guest, startAsGuest, isOnboarded, setOnboarded } = useGuest()
  const [connected, setConnected] = useState(false)
  const [peer, setPeer] = useState(null)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [pendingRequests, setPendingRequests] = useState([])

  const socketRef = useRef(null)
  const [activeTab, setActiveTab] = useState('random')

  const isAuthenticated = !!localStorage.getItem('ap-auth-demo')

  useEffect(() => {
    if (!isOnboarded) return
    if (!guest) startAsGuest()

    const s = socketApi.connect(guest || undefined)
    socketRef.current = s
    setConnected(!!s && s.connected)

    const offConnect = socketApi.on('connect', () => setConnected(true))
    const offDisconnect = socketApi.on('disconnect', () => setConnected(false))

    const offPaired = socketApi.on('paired', ({ peerId, peerMeta }) => {
      setPeer({ id: peerId, meta: peerMeta })
      setMessages((m) => [...m, { id: `sys_${Date.now()}`, system: true, text: 'Paired with stranger' }])
    })

    const offUnpaired = socketApi.on('unpaired', () => {
      setPeer(null)
      setMessages((m) => [...m, { id: `sys_${Date.now()}`, system: true, text: 'Unpaired' }])
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
      setPendingRequests((p) => [...p, req])
    })

    const offFriendAdded = socketApi.on('friend_added', (friend) => {
      setMessages((m) => [...m, { id: `sys_${Date.now()}`, system: true, text: `You are now friends with ${friend.name || friend.id}` }])
    })

    const offFriendDeclined = socketApi.on('friend_declined', () => {
      setMessages((m) => [...m, { id: `sys_${Date.now()}`, system: true, text: 'Friend request declined' }])
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
  }, [isOnboarded, guest, startAsGuest])

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

  function handleNext() { socketApi.skipRandom(); socketApi.findRandom() }
  function handleExit() { socketApi.stopRandom() }
  function handleAddFriend() {
    if (!peer) return
    socketApi.sendFriendRequest(peer.id, { name: guest?.name, avatarEmoji: guest?.avatarEmoji })
    setMessages((m) => [...m, { id: `sys_${Date.now()}`, system: true, text: 'Friend request sent' }])
  }

  function acceptRequest(req) {
    socketApi.respondFriendRequest(req.id, true)
    setPendingRequests((p) => p.filter(r => r.id !== req.id))
  }

  function declineRequest(req) {
    socketApi.respondFriendRequest(req.id, false)
    setPendingRequests((p) => p.filter(r => r.id !== req.id))
  }

  const emitTyping = useCallback(() => { socketRef.current?.emit && socketRef.current.emit('typing') }, [])
  const emitStopTyping = useCallback(() => { socketRef.current?.emit && socketRef.current.emit('stop_typing') }, [])

  if (!isOnboarded) {
    return <AnonymousOnboarding onComplete={() => setOnboarded(true)} />
  }

  return (
    <main className="min-h-screen flex bg-gray-900 text-white">
      <ChatSidebar
        guest={guest}
        connected={connected}
        onNext={handleNext}
        onExit={handleExit}
        onAddFriend={handleAddFriend}
        isAuthenticated={isAuthenticated}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <section className="flex-1 flex flex-col">
        <ChatHeader peer={peer} onAddFriend={handleAddFriend} />

        <MessageList messages={messages} typing={typing} guestId={guest?.id} />

        <ChatComposer onSend={send} onTypingStart={emitTyping} onTypingStop={emitStopTyping} disabled={!peer} />
      </section>

      <FriendRequestsPanel requests={pendingRequests} onAccept={acceptRequest} onDecline={declineRequest} />
    </main>
  )
}
