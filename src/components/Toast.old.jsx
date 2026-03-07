// src/components/VideoChat.jsx
import React, { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"
import socket from "../api/socket"

export default function VideoChat({ config, onEnd }) {
  const { push: toast } = useToast()

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  const localStreamRef = useRef(null)
  const remoteStreamRef = useRef(null)
  const pcRef = useRef(null)

  const [muted, setMuted] = useState(false)
  const [cameraOff, setCameraOff] = useState(false)
  const [status, setStatus] = useState("initial") // initial | ready | searching | connecting | connected | error
  const [isSearching, setIsSearching] = useState(false)
  const [isPremium] = useState(!!config?.isPremium)
  const [showUpsell, setShowUpsell] = useState(false)

  // -------------------------------------------------------
  // START SEARCH
  // -------------------------------------------------------
  const startSearch = useCallback(() => {
    if (!socket.connected) socket.connect()

    setStatus("searching")
    setIsSearching(true)

    socket.emit("video-find-random", {
      ...config,
      isPremium,
    })

    toast({
      title: "Searching for a stranger…",
      description: isPremium
        ? "You are prioritized as a premium user."
        : "Upgrade to premium for faster matching.",
    })
  }, [config, isPremium, toast])

  // -------------------------------------------------------
  // SOCKET EVENT WIRING
  // -------------------------------------------------------
  const wireSocketEvents = useCallback(() => {
    socket.off("video-ready")
    socket.off("video-offer")
    socket.off("video-answer")
    socket.off("ice-candidate")
    socket.off("video-end")

    socket.on("video-ready", handleVideoReady)
    socket.on("video-offer", handleOffer)
    socket.on("video-answer", handleAnswer)
    socket.on("ice-candidate", handleCandidate)
    socket.on("video-end", handleRemoteEnd)
  }, [])

  // -------------------------------------------------------
  // INITIALIZE LOCAL MEDIA
  // -------------------------------------------------------
  useEffect(() => {
    let mounted = true

    const startLocal = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        localStreamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        setStatus("ready")
        wireSocketEvents()
        startSearch()
      } catch (err) {
        console.error(err)
        setStatus("error")
        toast({
          title: "Camera/Mic blocked",
          description:
            "Please allow access to your camera and microphone in your browser settings.",
          variant: "error",
        })
      }
    }

    startLocal()

    return () => {
      mounted = false
      cleanup()
    }
  }, [startSearch, toast, wireSocketEvents])

  // -------------------------------------------------------
  // CLEANUP
  // -------------------------------------------------------
  const cleanup = () => {
    socket.off("video-ready", handleVideoReady)
    socket.off("video-offer", handleOffer)
    socket.off("video-answer", handleAnswer)
    socket.off("ice-candidate", handleCandidate)
    socket.off("video-end", handleRemoteEnd)

    if (pcRef.current) {
      pcRef.current.close()
      pcRef.current = null
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop())
      localStreamRef.current = null
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((t) => t.stop())
      remoteStreamRef.current = null
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
      remoteVideoRef.current.classList.add("hidden")
    }

    setIsSearching(false)
  }

  // -------------------------------------------------------
  // CREATE PEER CONNECTION
  // -------------------------------------------------------
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", e.candidate)
      }
    }

    pc.ontrack = (e) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream()
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStreamRef.current
          remoteVideoRef.current.classList.remove("hidden")
        }
      }
      remoteStreamRef.current.addTrack(e.track)
      setStatus("connected")
      setIsSearching(false)

      toast({
        title: "Connected",
        description: "You are now in a video chat with a stranger.",
      })
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current)
      })
    }

    pcRef.current = pc
  }

  // -------------------------------------------------------
  // SIGNALING HANDLERS
  // -------------------------------------------------------
  const handleVideoReady = async () => {
    setStatus("connecting")
    createPeerConnection()

    const pc = pcRef.current
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    socket.emit("video-offer", offer)
  }

  const handleOffer = async (offer) => {
    setStatus("connecting")
    createPeerConnection()

    const pc = pcRef.current
    await pc.setRemoteDescription(new RTCSessionDescription(offer))

    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    socket.emit("video-answer", answer)
  }

  const handleAnswer = async (answer) => {
    const pc = pcRef.current
    if (!pc) return
    await pc.setRemoteDescription(new RTCSessionDescription(answer))
  }

  const handleCandidate = async (candidate) => {
    const pc = pcRef.current
    if (!pc) return
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (err) {
      console.error("ICE error", err)
    }
  }

  // -------------------------------------------------------
  // AUTO RETRY
  // -------------------------------------------------------
  const autoRetry = () => {
    setTimeout(() => {
      if (status !== "connected") {
        startSearch()
      }
    }, 1500)
  }

  // -------------------------------------------------------
  // REMOTE END
  // -------------------------------------------------------
  const handleRemoteEnd = () => {
    toast({
      title: "Stranger left",
      description: "Searching for a new match…",
    })
    cleanup()
    setStatus("ready")
    autoRetry()
  }

  // -------------------------------------------------------
  // SKIP
  // -------------------------------------------------------
  const handleSkip = () => {
    socket.emit("video-skip")
    toast({
      title: "Skipped",
      description: "Finding a new stranger for you…",
    })
    cleanup()
    setStatus("ready")
    startSearch()
  }

  // -------------------------------------------------------
  // MUTE / CAMERA
  // -------------------------------------------------------
  const toggleMute = () => {
    if (!localStreamRef.current) return
    const audioTracks = localStreamRef.current.getAudioTracks()
    if (!audioTracks.length) return
    const next = !muted
    audioTracks.forEach((t) => (t.enabled = !next))
    setMuted(next)
  }

  const toggleCamera = () => {
    if (!localStreamRef.current) return
    const videoTracks = localStreamRef.current.getVideoTracks()
    if (!videoTracks.length) return
    const next = !cameraOff
    videoTracks.forEach((t) => (t.enabled = !next))
    setCameraOff(next)
  }

  // -------------------------------------------------------
  // END CHAT
  // -------------------------------------------------------
  const handleEnd = () => {
    socket.emit("video-end")
    cleanup()
    if (typeof onEnd === "function") onEnd()
  }

  // -------------------------------------------------------
  // STATUS TEXT
  // -------------------------------------------------------
  const statusText = (() => {
    if (status === "initial") return "Requesting access to your camera and microphone…"
    if (status === "ready" && isSearching) return "Searching for a stranger…"
    if (status === "ready") return "Ready. Tap skip to search again."
    if (status === "searching") return "Searching for a stranger…"
    if (status === "connecting") return "Connecting…"
    if (status === "connected") return "Connected"
    if (status === "error") return "Could not access camera/mic."
    return ""
  })()

  const showConnectingAnimation = status === "searching" || status === "connecting"

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
  return (
    <>
      <div className="w-full max-w-5xl rounded-2xl bg-slate-950/80 border border-white/5 shadow-2xl p-4 sm:p-6 text-slate-100 flex flex-col gap-4">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 flex items-center gap-2">
              Video Chat
              {isPremium && (
                <span className="inline-flex items-center rounded-full bg-amber-500/10 text-amber-300 px-2 py-0.5 text-[10px] border border-amber-400/40">
                  PREMIUM
                </span>
              )}
            </p>
            <p className="text-sm text-slate-200">{statusText}</p>
          </div>

          <div className="flex items-center gap-2">
            {!isPremium && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUpsell(true)}
                className="border-amber-400/60 text-amber-300 hover:bg-amber-500/10"
              >
                Go Premium
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSkip}
              className="border-slate-500/60 text-slate-200 hover:bg-slate-700/40"
            >
              Skip
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEnd}
              className="border-red-500/60 text-red-400 hover:bg-red-500/10"
            >
              End Chat
            </Button>
          </div>
        </div>

        {/* VIDEO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[320px] sm:h-[380px]">
          {/* LOCAL VIDEO */}
          <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-xs text-slate-100">
              You {isPremium && <span className="ml-1 text-amber-300">(Premium)</span>}
            </div>
          </div>

          {/* REMOTE VIDEO */}
          <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover hidden" />
            {status !== "connected" && (
              <div className="flex flex-col items-center gap-2 text-sm text-slate-400">
                {showConnectingAnimation && (
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse [animation-delay:300ms]" />
                  </div>
                )}
                <div>
                  {status === "searching" || status === "connecting"
                    ? "Looking for a stranger…"
                    : "Waiting to connect to a stranger…"}
                </div>
                {!isPremium && (
                  <div className="text-xs text-amber-300/80 mt-1">
                    Premium users get faster matching and priority in the queue.
                  </div>
                )}
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-xs text-slate-100">
              Stranger
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={toggleMute}
            className="bg-slate-900/80 border-slate-700 text-slate-100 hover:bg-slate-800"
          >
            {muted ? "Unmute" : "Mute"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={toggleCamera}
            className="bg-slate-900/80 border-slate-700 text-slate-100 hover:bg-slate-800"
          >
            {cameraOff ? "Turn Camera On" : "Turn Camera Off"}
          </Button>
        </div>
      </div>

      {/* PREMIUM UPSELL MODAL */}
      {!isPremium && showUpsell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-300">Upgrade to Premium</p>
                <h2 className="text-lg font-semibold mt-1">Faster matches. Priority in the queue.</h2>
              </div>
              <button
                onClick={() => setShowUpsell(false)}
                className="text-slate-400 hover:text-slate-200 text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <ul className="text-sm text-slate-300 space-y-1 mb-4">
              <li>• Priority matching in both text and video chat</li>
              <li>• Reduced wait times when searching for strangers</li>
              <li>• Better pairing when queues are busy</li>
            </ul>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowUpsell(false)}
                className="border-slate-600 text-slate-200 hover:bg-slate-800"
              >
                Maybe later
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Premium coming soon",
                    description: "Premium subscriptions will be available in a future update.",
                  })
                  setShowUpsell(false)
                }}
                className="bg-amber-500 text-slate-900 hover:bg-amber-400"
              >
                I’m interested
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
