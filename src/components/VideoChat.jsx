import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from './ui/use-toast'
import * as socketApi from '../api/socket'
import { useAuthStore } from '../store/useStore'

const ICE_SERVERS_DEFAULT = [{ urls: 'stun:stun.l.google.com:19302' }]

// ─── Status machine ─────────────────────────────────────────────────────────
// initial → searching → connecting → countdown → connected → reconnecting → ended

export default function VideoChat({ config, onEnd }) {
  const { toast } = useToast()
  const { isAuthenticated, isGuest } = useAuthStore()

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const pcRef = useRef(null)
  const turnConfigRef = useRef(null)
  const graceTimerRef = useRef(null)
  const graceWindowRef = useRef(30000) // default, updated from server
  const intentionalEnd = useRef(false)

  const [status, setStatus] = useState('initial')
  const [countdown, setCountdown] = useState(0)
  const [graceLeft, setGraceLeft] = useState(0)  // seconds left in reconnect window
  const [muted, setMuted] = useState(false)
  const [cameraOff, setCameraOff] = useState(false)
  const [isPremium] = useState(!!config?.isPremium)
  const countdownRef = useRef(null)

  // ─── socket helper ──────────────────────────────────────────────────────────
  const getSocket = useCallback(() => {
    let s = socketApi.getSocket()
    if (!s) {
      const identity = JSON.parse(localStorage.getItem('ap-guest-identity') || '{}')
      s = socketApi.connect(identity)
    }
    return s
  }, [])

  // ─── peer connection ────────────────────────────────────────────────────────
  const createPC = useCallback((iceRestart = false) => {
    if (pcRef.current && !iceRestart) return pcRef.current
    if (pcRef.current) { pcRef.current.close(); pcRef.current = null }

    const iceServers = turnConfigRef.current?.iceServers ?? ICE_SERVERS_DEFAULT
    const pc = new RTCPeerConnection({ iceServers })

    pc.onicecandidate = (e) => {
      if (e.candidate) getSocket().emit('ice-candidate', e.candidate)
    }

    pc.ontrack = (e) => {
      console.log('[WebRTC] ontrack — remote stream arrived')
      if (remoteVideoRef.current && e.streams?.[0]) {
        remoteVideoRef.current.srcObject = e.streams[0]
        remoteVideoRef.current.classList.remove('hidden')
      }
      startCountdown()
    }

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState
      console.log('[WebRTC] connectionState:', state)
      if (state === 'disconnected' || state === 'failed') {
        // ICE layer broken — attempt ICE restart
        handleIceFailure()
      } else if (state === 'connected') {
        setStatus('connected')
      }
    }

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] iceConnectionState:', pc.iceConnectionState)
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => {
        pc.addTrack(t, localStreamRef.current)
      })
    }

    pcRef.current = pc
    return pc
  }, [getSocket])

  // ─── countdown overlay ──────────────────────────────────────────────────────
  const startCountdown = useCallback(() => {
    if (countdownRef.current) return
    setStatus('countdown')
    setCountdown(3)
    let count = 3
    countdownRef.current = setInterval(() => {
      count -= 1
      setCountdown(count)
      if (count <= 0) {
        clearInterval(countdownRef.current)
        countdownRef.current = null
        setStatus('connected')
        toast({ title: 'Connected! 🎉', description: 'Live with a stranger.' })
      }
    }, 1000)
  }, [toast])

  // ─── cleanup ────────────────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null }
    if (graceTimerRef.current) { clearInterval(graceTimerRef.current); graceTimerRef.current = null }
    if (pcRef.current) { pcRef.current.close(); pcRef.current = null }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop())
      localStreamRef.current = null
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null
    if (remoteVideoRef.current) { remoteVideoRef.current.srcObject = null; remoteVideoRef.current.classList.add('hidden') }
  }, [])

  // ─── ICE restart ────────────────────────────────────────────────────────────
  const handleIceFailure = useCallback(async () => {
    console.log('[WebRTC] ICE failure — attempting ICE restart')
    const pc = pcRef.current
    if (!pc) return
    try {
      const offer = await pc.createOffer({ iceRestart: true })
      await pc.setLocalDescription(offer)
      getSocket().emit('video-offer', { type: offer.type, sdp: offer.sdp })
      console.log('[WebRTC] ICE restart offer sent')
    } catch (err) {
      console.error('[WebRTC] ICE restart failed', err)
    }
  }, [getSocket])

  // ─── grace-window countdown UI ──────────────────────────────────────────────
  const startGraceCountdown = useCallback((windowMs) => {
    graceWindowRef.current = windowMs
    let remaining = Math.ceil(windowMs / 1000)
    setGraceLeft(remaining)
    setStatus('reconnecting')

    if (graceTimerRef.current) clearInterval(graceTimerRef.current)
    graceTimerRef.current = setInterval(() => {
      remaining -= 1
      setGraceLeft(remaining)
      if (remaining <= 0) {
        clearInterval(graceTimerRef.current)
        graceTimerRef.current = null
      }
    }, 1000)
  }, [])

  // ─── signaling handlers ─────────────────────────────────────────────────────
  const handleVideoReady = useCallback(async (payload) => {
    console.log('[Signal] video-ready', payload)
    if (payload?.turnConfig) turnConfigRef.current = payload.turnConfig
    setStatus('connecting')
    const pc = createPC()
    try {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      getSocket().emit('video-offer', { type: offer.type, sdp: offer.sdp })
    } catch (err) { console.error('[Signal] offer error', err) }
  }, [createPC, getSocket])

  const handleOffer = useCallback(async (offer) => {
    console.log('[Signal] video-offer received')
    setStatus('connecting')
    const pc = createPC()
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      getSocket().emit('video-answer', { type: answer.type, sdp: answer.sdp })
    } catch (err) { console.error('[Signal] answer error', err) }
  }, [createPC, getSocket])

  const handleAnswer = useCallback(async (answer) => {
    const pc = pcRef.current
    if (!pc) return
    try { await pc.setRemoteDescription(new RTCSessionDescription(answer)) }
    catch (err) { console.error('[Signal] setRemoteDescription answer failed', err) }
  }, [])

  const handleCandidate = useCallback(async (candidate) => {
    const pc = pcRef.current
    if (!pc || !candidate) return
    try { await pc.addIceCandidate(new RTCIceCandidate(candidate)) }
    catch (err) { console.warn('[Signal] addIceCandidate failed', err) }
  }, [])

  const handleRemoteEnd = useCallback(() => {
    console.log('[Signal] video-end received')
    if (graceTimerRef.current) { clearInterval(graceTimerRef.current); graceTimerRef.current = null }
    toast({ title: 'Call ended', description: 'Stranger disconnected.' })
    cleanup()
    setStatus('ended')
  }, [cleanup, toast])

  const handleVideoSkipped = useCallback(() => {
    console.log('[Signal] video-skipped received')
    if (graceTimerRef.current) { clearInterval(graceTimerRef.current); graceTimerRef.current = null }
    toast({ title: 'You were skipped', description: 'Looking for another match…' })
    cleanup()
    setStatus('ended')
  }, [cleanup, toast])

  // ─── partner reconnecting: show grace countdown instead of ending ─────────
  const handlePartnerReconnecting = useCallback(({ graceWindowMs }) => {
    console.log('[Signal] partner-reconnecting, grace:', graceWindowMs)
    toast({ title: '⏳ Partner reconnecting…', description: `Holding session for ${Math.ceil(graceWindowMs / 1000)}s` })
    startGraceCountdown(graceWindowMs ?? 30000)
  }, [startGraceCountdown, toast])

  // ─── partner came back: resume ───────────────────────────────────────────
  const handlePartnerReconnected = useCallback(async () => {
    console.log('[Signal] partner-reconnected — resuming session')
    if (graceTimerRef.current) { clearInterval(graceTimerRef.current); graceTimerRef.current = null }
    toast({ title: '✅ Partner reconnected!', description: 'Resuming the call.' })
    setStatus('connecting')

    // Trigger ICE restart so the reconnected peer can re-negotiate
    await handleIceFailure()
  }, [handleIceFailure, toast])

  // ─── session-not-found: treat as fresh search ───────────────────────────
  const handleSessionNotFound = useCallback(() => {
    console.log('[Signal] session-not-found')
    setStatus('searching')
    startSearch()
  }, [])

  // ─── session-resumed (own reconnect confirmed) ───────────────────────────
  const handleSessionResumed = useCallback(({ partnerId }) => {
    console.log('[Signal] session-resumed, partner:', partnerId)
    toast({ title: '✅ Reconnected!', description: 'Resuming your video session.' })
    setStatus('connecting')
  }, [toast])

  // ─── search ──────────────────────────────────────────────────────────────
  const startSearch = useCallback(() => {
    const s = getSocket()
    const payload = { ...config, isPremium }

    // Check if we have a pending session to resume first
    const sessionId = socketApi.SESSION_ID
    const storedPartnerId = sessionStorage.getItem('ap-video-partner')
    if (storedPartnerId && sessionId) {
      console.log('[Signal] Attempting resume-session:', sessionId)
      s.emit('resume-session', { sessionId })
      setStatus('reconnecting')
      return
    }

    console.log('[Signal] Emitting video-find-random', payload)
    setStatus('searching')
    s.emit('video-find-random', payload)
  }, [config, getSocket, isPremium])

  // ─── mount ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (!mounted) { stream.getTracks().forEach(t => t.stop()); return }
        localStreamRef.current = stream
        if (localVideoRef.current) localVideoRef.current.srcObject = stream
      } catch (err) {
        console.error('[Media] getUserMedia failed', err)
        setStatus('error')
        toast({ title: 'Camera/Mic blocked', description: 'Allow access in browser settings.', variant: 'destructive' })
        return
      }

      const s = getSocket()

      // Wire all events
      s.off('video-ready', handleVideoReady)
      s.off('video-offer', handleOffer)
      s.off('video-answer', handleAnswer)
      s.off('ice-candidate', handleCandidate)
      s.off('video-end', handleRemoteEnd)
      s.off('video-skipped', handleVideoSkipped)
      s.off('partner-reconnecting', handlePartnerReconnecting)
      s.off('partner-reconnected', handlePartnerReconnected)
      s.off('session-not-found', handleSessionNotFound)
      s.off('session-resumed', handleSessionResumed)

      s.on('video-ready', handleVideoReady)
      s.on('video-offer', handleOffer)
      s.on('video-answer', handleAnswer)
      s.on('ice-candidate', handleCandidate)
      s.on('video-end', handleRemoteEnd)
      s.on('video-skipped', handleVideoSkipped)
      s.on('partner-reconnecting', handlePartnerReconnecting)
      s.on('partner-reconnected', handlePartnerReconnected)
      s.on('session-not-found', handleSessionNotFound)
      s.on('session-resumed', handleSessionResumed)

      startSearch()
    }

    init()

    return () => {
      mounted = false
      const s = socketApi.getSocket()
      if (s) {
        s.off('video-ready', handleVideoReady)
        s.off('video-offer', handleOffer)
        s.off('video-answer', handleAnswer)
        s.off('ice-candidate', handleCandidate)
        s.off('video-end', handleRemoteEnd)
        s.off('video-skipped', handleVideoSkipped)
        s.off('partner-reconnecting', handlePartnerReconnecting)
        s.off('partner-reconnected', handlePartnerReconnected)
        s.off('session-not-found', handleSessionNotFound)
        s.off('session-resumed', handleSessionResumed)

        if (intentionalEnd.current) {
          console.log('[Signal] Emitting video-end (intentional)')
          s.emit('video-end')
          intentionalEnd.current = false
        }
      }
      cleanup()
    }
  }, []) // once on mount

  // ─── controls ───────────────────────────────────────────────────────────
  const handleSkip = () => {
    getSocket().emit('video-skip')
    toast({ title: 'Skipped', description: 'Finding a new stranger…' })
    sessionStorage.removeItem('ap-video-partner')
    cleanup()
    setStatus('ended')
  }

  const handleEnd = () => {
    intentionalEnd.current = true
    getSocket().emit('video-end')
    sessionStorage.removeItem('ap-video-partner')
    cleanup()
    if (typeof onEnd === 'function') onEnd()
  }

  const toggleMute = () => {
    if (!localStreamRef.current) return
    const next = !muted
    localStreamRef.current.getAudioTracks().forEach(t => (t.enabled = !next))
    setMuted(next)
  }

  const toggleCamera = () => {
    if (!localStreamRef.current) return
    const next = !cameraOff
    localStreamRef.current.getVideoTracks().forEach(t => (t.enabled = !next))
    setCameraOff(next)
  }

  // ─── friend request ───────────────────────────────────────────────────────
  const handleAddFriend = useCallback(() => {
    if (!isAuthenticated || isGuest) {
      toast({ title: 'Sign in required', description: 'Please sign in to add friends.', variant: 'destructive' })
      return
    }
    const partnerId = sessionStorage.getItem('ap-video-partner')
    if (!partnerId) return
    const s = getSocket()
    const { user } = useAuthStore.getState()
    const fromMeta = { id: user.id, displayName: user.displayName, avatar: user.avatar }

    s.emit('friend_request', { toId: partnerId, fromMeta })
    toast({ title: 'Friend Request Sent', description: 'Sent to Stranger' })
  }, [isAuthenticated, isGuest, getSocket, toast])

  const findNew = () => {
    sessionStorage.removeItem('ap-video-partner')
    setStatus('searching')
    const s = getSocket()
    s.emit('video-find-random', { ...config, isPremium })
    toast({ title: 'Searching…' })
  }

  // ─── status label ────────────────────────────────────────────────────────
  const statusLabel = {
    initial: 'Requesting camera access…',
    searching: 'Searching for a stranger…',
    connecting: 'Connecting…',
    countdown: 'Get ready…',
    connected: 'Connected',
    reconnecting: `Partner reconnecting… ${graceLeft}s`,
    ended: 'Chat ended',
    error: 'Camera/mic blocked',
  }[status] ?? status

  const isActive = status === 'connecting' || status === 'countdown' || status === 'connected'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl p-4 sm:p-6 text-white flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${status === 'connected' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]' :
            status === 'reconnecting' ? 'bg-amber-400 animate-pulse' :
              status === 'searching' || status === 'connecting' || status === 'countdown'
                ? 'bg-amber-400 animate-pulse' : 'bg-zinc-600'
            }`} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              Video Chat
              {isPremium && <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-2 py-0.5 text-[10px]">PREMIUM</span>}
            </p>
            <p className="text-sm text-zinc-300">{statusLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === 'connected' && (
            <button
              onClick={handleAddFriend}
              className="px-4 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-sm font-semibold border border-emerald-500/30 transition-all active:scale-95 flex items-center gap-1"
            >
              <span>+</span> Friend
            </button>
          )}
          {isActive && (
            <button
              onClick={handleSkip}
              className="px-4 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium border border-zinc-600 transition-all active:scale-95"
            >
              ⏭ Skip
            </button>
          )}
          <button
            onClick={handleEnd}
            className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all active:scale-95"
          >
            ✕ End
          </button>
        </div>
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[320px] sm:h-[400px]">
        {/* Local */}
        <div className="relative rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-xs text-white">
            You {isPremium && <span className="text-amber-300 ml-1">★</span>}
          </span>
        </div>

        {/* Remote */}
        <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-700 flex items-center justify-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover hidden ${status === 'countdown' ? 'blur-2xl' : ''}`}
          />

          {/* Searching overlay */}
          <AnimatePresence>
            {status === 'searching' && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 z-20 backdrop-blur-md"
              >
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-20 h-20 bg-ap-indigo/10 rounded-full flex items-center justify-center mb-6">
                  <div className="w-10 h-10 bg-ap-indigo rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)]" />
                </motion.div>
                <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">Finding someone interesting...</h3>
                <p className="text-sm text-zinc-400 font-medium">Searching globally 🌍</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Countdown overlay */}
          <AnimatePresence>
            {status === 'countdown' && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
              >
                <motion.span
                  key={countdown}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.6, opacity: 0 }}
                  className="text-8xl font-black text-white drop-shadow-2xl"
                >
                  {countdown}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reconnecting overlay */}
          <AnimatePresence>
            {status === 'reconnecting' && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 z-10 backdrop-blur-sm"
              >
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-center">
                  <p className="text-white font-semibold">Partner reconnecting…</p>
                  <p className="text-amber-400 text-sm mt-1">Holding session for <span className="font-bold text-xl">{graceLeft}s</span></p>
                </div>
                {/* Grace window progress bar */}
                <div className="w-48 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-amber-500 rounded-full"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: graceWindowRef.current / 1000, ease: 'linear' }}
                  />
                </div>
                <p className="text-xs text-zinc-500">Call will end if partner doesn't return</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Searching/connecting spinner */}
          {(status === 'searching' || status === 'connecting') && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-zinc-400 text-sm">{statusLabel}</p>
            </div>
          )}

          {/* Ended state */}
          {status === 'ended' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <p className="text-zinc-400 text-sm">Call ended</p>
              <button
                onClick={findNew}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-sm font-semibold hover:opacity-90 transition-all"
              >
                🔄 Find New Stranger
              </button>
            </div>
          )}

          {status !== 'connected' && status !== 'countdown' && status !== 'searching' &&
            status !== 'connecting' && status !== 'reconnecting' && status !== 'ended' && (
              <p className="text-zinc-500 text-sm">Waiting for stranger…</p>
            )}

          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-xs text-white z-20">Stranger</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={toggleMute}
          className={`px-4 py-2 rounded-lg text-sm border transition-all ${muted ? 'bg-red-600/30 border-red-500/50 text-red-300' : 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700'
            }`}
        >
          {muted ? '🔇 Unmute' : '🎤 Mute'}
        </button>
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded-lg text-sm border transition-all ${cameraOff ? 'bg-red-600/30 border-red-500/50 text-red-300' : 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700'
            }`}
        >
          {cameraOff ? '📷 Camera On' : '🚫 Camera Off'}
        </button>
      </div>
    </motion.div>
  )
}
