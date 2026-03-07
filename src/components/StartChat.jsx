import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { PremiumUpsellModal } from './PremiumUpsellModal'
import { useToast } from './ui/use-toast'

const TRENDING_INTERESTS = [
  'anime', 'gaming', 'music', 'fitness', 'movies',
  'reading', 'coding', 'art', 'travel', 'cooking', 'photography', 'sports',
]

export default function StartChat({ onStartChat }) {
  const { toast } = useToast()
  const [genderPreference, setGenderPreference] = useState('everyone')
  const [interests, setInterests] = useState([])
  const [customInterest, setCustomInterest] = useState('')
  const [isPremium, setIsPremium] = useState(false)
  const [showUpsell, setShowUpsell] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    const storedGender = localStorage.getItem('ap-gender')
    const storedInterests = localStorage.getItem('ap-interests')
    if (storedGender) setGenderPreference(storedGender)
    if (storedInterests) {
      try {
        const parsed = JSON.parse(storedInterests)
        if (Array.isArray(parsed)) setInterests(parsed)
      } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => { localStorage.setItem('ap-gender', genderPreference) }, [genderPreference])
  useEffect(() => { localStorage.setItem('ap-interests', JSON.stringify(interests)) }, [interests])

  const toggleInterest = (tag) =>
    setInterests((prev) => prev.includes(tag) ? prev.filter((i) => i !== tag) : [...prev, tag])

  const addCustomInterest = () => {
    const value = customInterest.trim().toLowerCase()
    if (!value) return
    if (!interests.includes(value)) setInterests((prev) => [...prev, value])
    setCustomInterest('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addCustomInterest() }
  }

  const handleStart = (mode) => {
    if (mode === 'video' && !consentGiven) {
      toast({
        title: 'Consent Required',
        description: 'Please check the camera/mic consent box to start video chat.',
        variant: 'destructive',
      })
      return
    }
    if (genderPreference !== 'everyone' && !isPremium) {
      setShowUpsell(true)
      return
    }
    if (typeof onStartChat === 'function') {
      onStartChat({ mode, genderPreference, interests, isPremium })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-xl rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl p-6 sm:p-8"
    >
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight">
        Ready to Connect?
      </h1>
      <p className="text-sm text-zinc-400 mb-6">
        Choose who you want to chat with and add a few interests to find better matches.
      </p>

      {/* Gender filter */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
          Who do you want to chat with?
        </p>
        <div className="flex gap-2">
          {[
            { id: 'male', label: '♂ Male' },
            { id: 'female', label: '♀ Female' },
            { id: 'everyone', label: '🌐 Everyone' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setGenderPreference(opt.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${genderPreference === opt.id
                  ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white'
                }`}
            >
              {opt.label}
              {opt.id !== 'everyone' && (
                <span className="ml-1.5 text-[10px] font-bold bg-amber-600 text-black rounded-full px-1.5 py-0.5">
                  PRO
                </span>
              )}
            </button>
          ))}
        </div>
        {genderPreference !== 'everyone' && !isPremium && (
          <p className="text-xs text-amber-400 mt-2">
            ⭐ Gender filters are a Premium feature. Upgrade to match by gender.
          </p>
        )}
      </div>

      {/* Interests */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
          Optional Interests
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {TRENDING_INTERESTS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleInterest(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${interests.includes(tag)
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add custom interest..."
            className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
          />
          <button
            type="button"
            onClick={addCustomInterest}
            className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium border border-zinc-600 transition-colors"
          >
            Add
          </button>
        </div>

        {interests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {interests.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-[13px] text-zinc-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setInterests((prev) => prev.filter((i) => i !== tag))}
                  className="text-zinc-500 hover:text-red-400 transition-colors font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Consent */}
      <div className="mb-6 bg-zinc-800/60 p-4 rounded-xl border border-zinc-700">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="mt-0.5 w-4 h-4 cursor-pointer accent-amber-500"
          />
          <span className="text-sm text-zinc-300 leading-relaxed select-none">
            I consent to sharing my camera and microphone. I understand my video is
            transmitted peer-to-peer and may be monitored for safety violations.
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <button
          type="button"
          onClick={() => handleStart('text')}
          className="flex-1 h-12 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-semibold text-sm border border-zinc-600 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          💬 Start Text Chat
        </button>
        <button
          type="button"
          onClick={() => handleStart('video')}
          className={`flex-1 h-12 rounded-xl font-semibold text-sm transition-all active:scale-[0.99] ${consentGiven
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-400 hover:to-yellow-300 hover:scale-[1.01] shadow-lg shadow-amber-500/30'
              : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
            }`}
        >
          🎥 Start Video Chat {!consentGiven && '(consent required)'}
        </button>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-zinc-500">
          Be respectful. No harassment, hate, or explicit content.
        </p>
        <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 hover:border-amber-500/40 transition-colors">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="accent-amber-500 cursor-pointer"
          />
          <span className="text-xs text-amber-400 font-semibold">⭐ Mock Premium</span>
        </label>
      </div>

      <PremiumUpsellModal open={showUpsell} onOpenChange={setShowUpsell} />
    </motion.div>
  )
}
