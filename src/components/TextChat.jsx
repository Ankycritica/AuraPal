import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as socketApi from '../api/socket'
import { useToast } from './ui/use-toast-hook'
import { useAuthStore } from '../store/useStore'

// ─── Emoji reactions ───────────────────────────────────────────────────────
const REACTIONS = ['👍', '😂', '❤️', '😮', '👏', '🔥']

export default function TextChat({ config, onEnd }) {
    const { toast } = useToast()
    const { isAuthenticated, isGuest } = useAuthStore()

    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [status, setStatus] = useState('searching')  // searching | chatting | ended
    const [isTyping, setIsTyping] = useState(false)
    const [peerInfo, setPeerInfo] = useState(null)
    const [showReactions, setShowReactions] = useState(null)
    const [localTyping, setLocalTyping] = useState(false)

    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)
    const fileInputRef = useRef(null)
    const typingTimer = useRef(null)
    // Track whether this is a real unmount or React StrictMode double-invoke
    const intentionalEnd = useRef(false)
    // Capture socket.id at pair time so message ownership is stable
    const mySocketId = useRef(null)
    const searchTimeoutRef = useRef(null)

    // ─── socket helper ─────────────────────────────────────────────────────────
    const getSocket = useCallback(() => {
        let s = socketApi.getSocket()
        if (!s) {
            const identity = JSON.parse(localStorage.getItem('ap-guest-identity') || '{}')
            s = socketApi.connect(identity)
        }
        return s
    }, [])

    // ─── system msg helper ─────────────────────────────────────────────────────
    const sysMsg = (text) => ({
        id: `sys_${Date.now()}_${Math.random()}`,
        text, system: true, ts: Date.now(),
    })

    // ─── mount / unmount ───────────────────────────────────────────────────────
    useEffect(() => {
        const s = getSocket()
        mySocketId.current = s.id

        // ── handlers ─────────────────────────────────────────────────────────────
        const onPaired = (data) => {
            console.log('[TextChat] paired:', data)
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
            mySocketId.current = s.id          // refresh in case socket reconnected
            setPeerInfo(data.partner)
            setStatus('chatting')
            setMessages([sysMsg('✅ Connected! Say hello 👋')])
            toast({ title: 'Connected!', description: 'Stranger joined the chat.' })
            setTimeout(() => inputRef.current?.focus(), 50)
        }

        const onMessage = (msg) => {
            setMessages(prev => [...prev, { ...msg, reactions: {} }])
        }

        const onTyping = () => setIsTyping(true)
        const onStopTyping = () => setIsTyping(false)

        const onUnpaired = () => {
            console.log('[TextChat] unpaired by server')
            setStatus('ended')
            setMessages(prev => [...prev, sysMsg('👋 Stranger disconnected.')])
            setIsTyping(false)
        }

        s.on('paired', onPaired)
        s.on('chat_message', onMessage)
        s.on('typing', onTyping)
        s.on('stop_typing', onStopTyping)
        s.on('unpaired', onUnpaired)
        s.on('connect_error', (err) => {
            console.error('[TextChat] Connection error:', err)
            setStatus('ended')
            setMessages([sysMsg('❌ Connection to server failed. Please check your internet or try again later.')])
        })

        // Emit find_random — only do this once on real mount
        console.log('[TextChat] Emitting find_random')
        const identity = JSON.parse(localStorage.getItem('ap-guest-identity') || '{}')
        
        // Wait until connected before emitting, or socket.io will buffer it (which is fine, but we need to start timeout)
        s.emit('find_random', {
            ...identity,
            isPremium: config?.isPremium ?? false,
            genderPreference: config?.genderPreference ?? 'everyone',
            interests: config?.interests ?? [],
        })
        setMessages([sysMsg('🔍 Searching for a stranger…')])
        
        searchTimeoutRef.current = setTimeout(() => {
            if (s && s.connected) {
                console.warn('[TextChat] Matchmaking timeout reached')
                s.emit('exit')
                setStatus('ended')
                setMessages([sysMsg('⏱️ Nobody is available right now. Please try again!')])
            }
        }, 15000)

        // The timeout is now reliably cleared inside the onPaired handler.

        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
            // Remove event listeners always
            s.off('paired', onPaired)
            s.off('chat_message', onMessage)
            s.off('typing', onTyping)
            s.off('stop_typing', onStopTyping)
            s.off('unpaired', onUnpaired)
            s.off('connect_error')

            // Only emit exit when the user deliberately ends — NOT on StrictMode cleanup
            if (intentionalEnd.current) {
                console.log('[TextChat] Emitting exit (intentional)')
                s.emit('exit')
                intentionalEnd.current = false
            }
        }
    }, [config?.genderPreference, config?.interests, config?.isPremium, getSocket, toast])

    // ─── auto-scroll ───────────────────────────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    // ─── send image ────────────────────────────────────────────────────────────
    const handleImageUpload = useCallback((e) => {
        const file = e.target.files?.[0]
        if (!file || status !== 'chatting') return
        
        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new window.Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const MAX_WIDTH = 800
                const MAX_HEIGHT = 800
                let width = img.width
                let height = img.height

                if (width > height) {
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH }
                } else {
                    if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT }
                }
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)
                
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
                const s = getSocket()
                const msgId = `m_${Date.now()}_img`
                const newMsg = {
                    id: msgId,
                    text: '',
                    image: dataUrl,
                    from: mySocketId.current || s.id,
                    ts: Date.now(),
                    reactions: {}
                }
                setMessages(prev => [...prev, newMsg])
                s.emit('chat_message', { id: msgId, text: '', image: dataUrl })
            }
            img.src = event.target.result
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }, [status, getSocket])

    // ─── send text ────────────────────────────────────────────────────────────
    const sendMessage = useCallback(() => {
        const text = input.trim()
        if (!text || status !== 'chatting') return
        const s = getSocket()
        const msg = { id: `m_${Date.now()}`, text, from: mySocketId.current || s.id, ts: Date.now(), reactions: {} }
        s.emit('chat_message', { id: msg.id, text })
        setMessages(prev => [...prev, msg])
        setInput('')
        clearTimeout(typingTimer.current)
        setLocalTyping(false)
        s.emit('stop_typing')
        setTimeout(() => inputRef.current?.focus(), 10)
    }, [input, status, getSocket])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
    }

    // ─── typing indicators ──────────────────────────────────────────────────────
    const handleInputChange = (e) => {
        setInput(e.target.value)
        const s = getSocket()
        if (e.target.value) {
            if (!localTyping) { setLocalTyping(true); s.emit('typing') }
            clearTimeout(typingTimer.current)
            typingTimer.current = setTimeout(() => { setLocalTyping(false); s.emit('stop_typing') }, 2000)
        } else {
            clearTimeout(typingTimer.current)
            setLocalTyping(false)
            s.emit('stop_typing')
        }
    }

    // ─── friend request ───────────────────────────────────────────────────────
    const handleAddFriend = useCallback(() => {
        if (!isAuthenticated || isGuest) {
            toast({ title: 'Sign in required', description: 'Please sign in to add friends.', variant: 'destructive' })
            return
        }
        if (!peerInfo?.id) return
        const s = getSocket()
        const { user } = useAuthStore.getState()
        const fromMeta = { id: user.id, displayName: user.displayName, avatar: user.avatar }

        s.emit('friend_request', { toId: peerInfo.id, fromMeta })
        toast({ title: 'Friend Request Sent', description: `Sent to ${peerInfo.guestName || 'Stranger'}` })
    }, [isAuthenticated, isGuest, peerInfo, getSocket, toast])

    // ─── skip ──────────────────────────────────────────────────────────────────
    const handleSkip = useCallback(() => {
        const s = getSocket()
        s.emit('skip_random')
        // Re-queue immediately
        const identity = JSON.parse(localStorage.getItem('ap-guest-identity') || '{}')
        s.emit('find_random', {
            ...identity,
            isPremium: config?.isPremium ?? false,
            genderPreference: config?.genderPreference ?? 'everyone',
            interests: config?.interests ?? [],
        })
        setStatus('searching')
        setPeerInfo(null)
        setIsTyping(false)
        setMessages([sysMsg('⏭ Skipped — searching for a new stranger…')])

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
        searchTimeoutRef.current = setTimeout(() => {
            if (s && s.connected) {
                console.warn('[TextChat] Matchmaking timeout reached (Skip)')
                s.emit('exit')
                setStatus('ended')
                setMessages([sysMsg('⏱️ Nobody is available right now. Please try again!')])
            }
        }, 15000)
    }, [config, getSocket])

    // ─── end (intentional) ────────────────────────────────────────────────────
    const handleEnd = useCallback((exit = true) => {
        if (exit) {
            intentionalEnd.current = true
            getSocket().emit('exit')
        }
        if (typeof onEnd === 'function') onEnd()
    }, [getSocket, onEnd])

    // ─── find new stranger (from ended state) ─────────────────────────────────
    const handleFindNew = useCallback(() => {
        const s = getSocket()
        mySocketId.current = s.id
        const identity = JSON.parse(localStorage.getItem('ap-guest-identity') || '{}')
        s.emit('find_random', {
            ...identity,
            isPremium: config?.isPremium ?? false,
            genderPreference: config?.genderPreference ?? 'everyone',
            interests: config?.interests ?? [],
        })
        setStatus('searching')
        setPeerInfo(null)
        setIsTyping(false)
        setMessages([sysMsg('🔍 Searching for a stranger…')])
        
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
        searchTimeoutRef.current = setTimeout(() => {
            if (s && s.connected) {
                console.warn('[TextChat] Matchmaking timeout reached (Find New)')
                s.emit('exit')
                setStatus('ended')
                setMessages([sysMsg('⏱️ Nobody is available right now. Please try again!')])
            }
        }, 15000)
    }, [config, getSocket])

    // ─── emoji reaction ───────────────────────────────────────────────────────
    const addReaction = (msgId, emoji) => {
        setMessages(prev => prev.map(m =>
            m.id === msgId ? { ...m, reactions: { ...m.reactions, [emoji]: (m.reactions?.[emoji] ?? 0) + 1 } } : m
        ))
        setShowReactions(null)
    }

    const socketId = mySocketId.current || socketApi.getSocket()?.id

    // ─── render ───────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${status === 'chatting' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' :
                        status === 'searching' ? 'bg-amber-400 animate-pulse' :
                            'bg-zinc-600'
                        }`} />
                    <div>
                        <p className="text-sm font-semibold text-white">
                            {status === 'chatting' ? (peerInfo?.guestName || 'Stranger') :
                                status === 'searching' ? 'Searching…' : 'Chat Ended'}
                        </p>
                        {status === 'chatting' && peerInfo?.country && (
                            <p className="text-[11px] text-zinc-500">{peerInfo.country}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Add Friend — available only while chatting */}
                    {status === 'chatting' && (
                        <button
                            onClick={handleAddFriend}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-all active:scale-95 flex items-center gap-1"
                        >
                            <span>+</span> Friend
                        </button>
                    )}

                    {/* Skip — available while searching OR chatting */}
                    {(status === 'chatting' || status === 'searching') && (
                        <button
                            onClick={handleSkip}
                            className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-medium border border-zinc-600 transition-all active:scale-95"
                        >
                            ⏭ Skip
                        </button>
                    )}
                    <button
                        onClick={() => handleEnd(true)}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-all active:scale-95"
                    >
                        ✕ End
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 relative">
                <AnimatePresence mode="wait">
                    {status === 'searching' ? (
                        <motion.div 
                            key="searching" 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                            className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-sm z-10"
                        >
                            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-20 h-20 bg-ap-indigo/10 rounded-full flex items-center justify-center mb-6">
                                <div className="w-10 h-10 bg-ap-indigo rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)]" />
                            </motion.div>
                            <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">Finding someone interesting...</h3>
                            <p className="text-sm text-zinc-400 font-medium">Searching globally 🌍</p>
                        </motion.div>
                    ) : (
                        <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3 h-full pb-4">
                            {messages.map((msg) => {
                                const isMe = msg.from === socketId
                                if (msg.system) return (
                                    <motion.div key={msg.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center my-4">
                                        <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500 bg-zinc-800/60 px-4 py-1.5 rounded-full border border-white/5">
                                            {msg.text}
                                        </span>
                                    </motion.div>
                                )

                                const hasReactions = msg.reactions && Object.keys(msg.reactions).length > 0
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                                    >
                                        <div className="relative max-w-[75%]">
                                            <div
                                                className={`relative px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm cursor-pointer select-text ${isMe
                                                    ? 'bg-ap-indigo text-white rounded-br-sm shadow-[0_4px_14px_rgba(79,70,229,0.3)]'
                                                    : 'bg-zinc-800 text-zinc-100 border border-white/5 rounded-bl-sm shadow-black/20'
                                                    }`}
                                                onDoubleClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                                            >
                                                {msg.image && (
                                                    <img src={msg.image} alt="shared" className="max-w-full max-h-64 rounded-md mb-2 object-contain" />
                                                )}
                                                {msg.text && <span>{msg.text}</span>}
                                            </div>

                                            {hasReactions && (
                                                <div className={`flex gap-1 mt-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                                                        <span key={emoji} className="text-[11px] font-bold bg-zinc-800 border border-white/10 text-white rounded-md px-2 py-0.5 shadow-sm">
                                                            {emoji}{count > 1 ? ` ${count}` : ''}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}


                                    <AnimatePresence>
                                        {showReactions === msg.id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, y: 4 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, y: 4 }}
                                                className={`absolute ${isMe ? 'right-0' : 'left-0'} -top-10 flex gap-1 bg-zinc-800 border border-white/10 rounded-full px-2 py-1 shadow-xl z-10`}
                                            >
                                                {REACTIONS.map(emoji => (
                                                    <button key={emoji} onClick={() => addReaction(msg.id, emoji)} className="text-base hover:scale-125 transition-transform">
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <p className={`text-[10px] text-zinc-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? 'text-right' : 'text-left'}`}>
                                        {/* eslint-disable-next-line react-hooks/purity */}
                                        {new Date(msg.ts || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>
            )}
        </AnimatePresence>

                <AnimatePresence>
                    {isTyping && (
                        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="flex justify-start">
                            <div className="bg-zinc-800 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm">
                                <div className="flex gap-1 items-center">
                                    {[0, 0.15, 0.3].map((delay, i) => (
                                        <div key={i} className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 pb-4 pt-3 bg-zinc-900 border-t border-white/10">
                {status === 'ended' ? (
                    <div className="flex gap-3">
                        <button
                            onClick={handleFindNew}
                            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold text-sm hover:opacity-90 transition-all"
                        >
                            🔄 Find New Stranger
                        </button>
                        <button
                            onClick={() => handleEnd(false)}
                            className="h-11 px-5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition-all"
                        >
                            Exit
                        </button>
                    </div>
                ) : (
                    <div className="flex items-end gap-2">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={status !== 'chatting'}
                            className="p-3 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                            title="Share Image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={status === 'searching' ? 'Waiting for a stranger to connect…' : 'Type a message… (Enter to send)'}
                            disabled={status !== 'chatting'}
                            rows={1}
                            className="flex-1 resize-none bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed max-h-32 overflow-y-auto"
                            style={{ minHeight: '44px' }}
                            onInput={e => {
                                e.target.style.height = 'auto'
                                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || status !== 'chatting'}
                            className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 text-black font-bold flex items-center justify-center flex-shrink-0 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                        >
                            <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </div>
                )}

                {status === 'chatting' && (
                    <p className="text-[11px] text-zinc-600 text-center mt-2">
                        Double-tap a message to react · Enter to send · Shift+Enter for newline
                    </p>
                )}
            </div>
        </div>
    )
}
