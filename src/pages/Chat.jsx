import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import StartChat from '../components/StartChat'
import TextChat from '../components/TextChat'
import VideoChat from '../components/VideoChat'

export default function Chat() {
  const [chatMode, setChatMode] = useState(null)   // null | 'text' | 'video'
  const [matchConfig, setMatchConfig] = useState(null)

  const handleStartChat = useCallback(({ mode, genderPreference, interests, isPremium }) => {
    setChatMode(mode)
    setMatchConfig({ genderPreference, interests, isPremium })
  }, [])

  const handleEndChat = useCallback(() => {
    setChatMode(null)
    setMatchConfig(null)
  }, [])

  return (
    <div
      className="flex min-h-screen"
      style={{ background: 'radial-gradient(ellipse at 20% 60%, rgba(212,175,55,0.04) 0%, transparent 60%), #09090b' }}
    >
      <Sidebar />

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* ── Top bar (only while chatting) ── */}
        <AnimatePresence>
          {chatMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-zinc-950/80 backdrop-blur-sm z-10"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${chatMode === 'text' ? 'bg-emerald-400' : 'bg-amber-400'} shadow-lg`} />
                <span className="text-sm font-semibold text-white">
                  {chatMode === 'text' ? '💬 Text Chat' : '🎥 Video Chat'}
                </span>
                {matchConfig?.isPremium && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-2 py-0.5">
                    ⭐ PREMIUM
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mode switcher */}
                <div className="flex bg-zinc-800 border border-zinc-700 rounded-lg p-0.5 gap-0.5">
                  <button
                    onClick={() => {
                      setChatMode(null)
                      setTimeout(() => {
                        setChatMode('text')
                      }, 100)
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${chatMode === 'text'
                        ? 'bg-zinc-600 text-white shadow'
                        : 'text-zinc-400 hover:text-white'
                      }`}
                  >
                    💬 Text
                  </button>
                  <button
                    onClick={() => {
                      setChatMode(null)
                      setTimeout(() => {
                        setChatMode('video')
                      }, 100)
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${chatMode === 'video'
                        ? 'bg-zinc-600 text-white shadow'
                        : 'text-zinc-400 hover:text-white'
                      }`}
                  >
                    🎥 Video
                  </button>
                </div>

                <button
                  onClick={handleEndChat}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-700 transition-all"
                >
                  ← Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Chat content ── */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* ─ Start screen ─ */}
            {!chatMode && (
              <motion.div
                key="start"
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -8 }}
                transition={{ duration: 0.3 }}
                className="w-full flex justify-center"
              >
                <StartChat onStartChat={handleStartChat} />
              </motion.div>
            )}

            {/* ─ Text chat ─ */}
            {chatMode === 'text' && (
              <motion.div
                key="text"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex"
                style={{ maxWidth: '780px', height: 'calc(100vh - 140px)', minHeight: '520px' }}
              >
                <TextChat config={matchConfig} onEnd={handleEndChat} />
              </motion.div>
            )}

            {/* ─ Video chat ─ */}
            {chatMode === 'video' && (
              <motion.div
                key="video"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <VideoChat config={matchConfig} onEnd={handleEndChat} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
