import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Video, MessageSquare, Plus, X as XIcon, Lock, Globe } from 'lucide-react'
import { PremiumUpsellModal } from './PremiumUpsellModal'
import { useToast } from './ui/use-toast'

const TRENDING_INTERESTS = [
  'anime', 'gaming', 'music', 'fitness', 'movies',
  'reading', 'coding', 'art', 'travel', 'cooking', 'photography', 'sports',
]

export default function StartChat({ onStartChat }) {
  const { toast } = useToast()
  const [genderPreference, setGenderPreference] = useState('everyone')
  const [countryFilter, setCountryFilter] = useState('global')
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
    if ((genderPreference !== 'everyone' || countryFilter !== 'global') && !isPremium) {
      setShowUpsell(true)
      return
    }
    if (typeof onStartChat === 'function') {
      onStartChat({ mode, genderPreference, interests, isPremium, countryFilter })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-xl rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl p-6 sm:p-8 relative overflow-hidden"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-ap-indigo/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-ap-emerald/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          Start Exploring
        </h1>
        <p className="text-sm text-zinc-400 max-w-sm mx-auto">
          Add tags to find people who share your vibe. Let's make a real connection.
        </p>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Match Settings (Gender & Geo) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Partner Gender</label>
            <div className="bg-zinc-800/50 p-1 rounded-xl border border-white/5 flex flex-col sm:flex-row gap-1">
              {[
                { id: 'everyone', label: 'Any' },
                { id: 'female', label: 'Female', pro: true },
                { id: 'male', label: 'Male', pro: true }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setGenderPreference(opt.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                    genderPreference === opt.id ? 'bg-ap-indigo text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                  {opt.pro && <Lock size={10} className={genderPreference === opt.id ? 'text-white/70' : 'text-ap-indigo'} />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Location</label>
            <div className="bg-zinc-800/50 p-1 rounded-xl border border-white/5 flex gap-1">
              <button
                onClick={() => setCountryFilter('global')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  countryFilter === 'global' ? 'bg-ap-indigo text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Global
              </button>
              <button
                onClick={() => setCountryFilter('local')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  countryFilter === 'local' ? 'bg-ap-indigo text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Local <Lock size={10} className={countryFilter === 'local' ? 'text-white/70' : 'text-ap-indigo'} />
              </button>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="bg-zinc-800/30 p-4 rounded-2xl border border-white/5">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Topic Tags</label>
          
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type an interest and hit Enter..."
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-ap-indigo focus:ring-1 focus:ring-ap-indigo transition-all"
              />
              <button
                onClick={addCustomInterest}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
             {TRENDING_INTERESTS.map((tag) => {
               const isActive = interests.includes(tag)
               return (
                 <button
                   key={tag}
                   onClick={() => toggleInterest(tag)}
                   className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                     isActive 
                       ? 'bg-ap-indigo/20 text-indigo-300 border-ap-indigo/30' 
                       : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                   }`}
                 >
                   #{tag}
                 </button>
               )
             })}
          </div>

          <AnimatePresence>
            {interests.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-3 border-t border-zinc-800 flex flex-wrap gap-2">
                <span className="text-xs text-zinc-500 font-semibold self-center mr-2">Your Tags:</span>
                {interests.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-700 text-xs font-semibold text-zinc-200">
                    {tag}
                    <button onClick={() => setInterests(prev => prev.filter(i => i !== tag))} className="text-zinc-400 hover:text-white">
                      <XIcon size={12} />
                    </button>
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Video Consent */}
        <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl hover:bg-zinc-800/50 transition-colors border border-transparent">
          <div className="pt-0.5">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-ap-indigo focus:ring-ap-indigo focus:ring-offset-zinc-900 cursor-pointer"
            />
          </div>
          <span className="text-[13px] text-zinc-400 leading-relaxed select-none group-hover:text-zinc-300 transition-colors">
            I consent to sharing my camera/microphone for video calls. Connections are P2P. Plase respect the community guidelines.
          </span>
        </label>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => handleStart('text')}
            className="flex-1 h-14 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm border border-zinc-700 hover:border-zinc-600 transition-all active:scale-[0.98] flex justify-center items-center gap-2 group"
          >
            <MessageSquare size={18} className="text-zinc-400 group-hover:text-white transition-colors" /> Start Text Chat
          </button>
          
          <button
            onClick={() => handleStart('video')}
            className={`flex-1 h-14 rounded-2xl font-bold text-sm transition-all flex justify-center items-center gap-2 relative overflow-hidden group ${
              consentGiven
                ? 'bg-ap-emerald text-white hover:bg-emerald-600 active:scale-[0.98] shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                : 'bg-zinc-800/50 text-zinc-500 border border-zinc-800 cursor-not-allowed'
            }`}
          >
            {consentGiven && <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/20 to-emerald-400/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />}
            <Video size={18} className={consentGiven ? 'text-white' : 'text-zinc-600'} /> Start Video Chat
          </button>
        </div>

        {/* Mock Premium Toggle Footer */}
        <div className="flex justify-center pt-2">
          <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 hover:border-ap-indigo/30 transition-colors">
            <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="cursor-pointer" />
            <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 flex items-center gap-1"><Crown size={12} className="text-indigo-400"/> Toggle Mock Premium</span>
          </label>
        </div>

      </div>

      <PremiumUpsellModal open={showUpsell} onOpenChange={setShowUpsell} />
    </motion.div>
  )
}
