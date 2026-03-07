// src/components/VideoChat.jsx
import React, { useRef } from 'react'
import { Button } from './ui/button'

export default function VideoChat({ config, onEnd }) {
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  return (
    <div className="w-full max-w-5xl rounded-2xl bg-slate-950/80 border border-white/5 shadow-2xl p-4 sm:p-6 text-slate-100 flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Video Chat
          </p>
          <p className="text-sm text-slate-200">
            Connecting you to a stranger…
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onEnd}
          className="border-red-500/60 text-red-400 hover:bg-red-500/10"
        >
          End Chat
        </Button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[320px] sm:h-[380px]">
        
        {/* Local Video */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-xs text-slate-100">
            You
          </div>
        </div>

        {/* Remote Video */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-xs text-slate-100">
            Stranger
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <Button
          type="button"
          variant="outline"
          className="bg-slate-900/80 border-slate-700 text-slate-100 hover:bg-slate-800"
        >
          Mute
        </Button>

        <Button
          type="button"
          variant="outline"
          className="bg-slate-900/80 border-slate-700 text-slate-100 hover:bg-slate-800"
        >
          Turn Camera Off
        </Button>
      </div>
    </div>
  )
}