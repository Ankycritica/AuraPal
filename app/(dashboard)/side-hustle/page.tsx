"use client"
import { useState } from "react"
import { Lightbulb, Loader2, Sparkles, Copy, RefreshCcw, DollarSign } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export default function SideHustlePage() {
  const [inputText, setInputText] = useState("")
  const [ideas, setIdeas] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter your skills/experience first!")
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature: "side_hustle", prompt: inputText }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setIdeas(data.result)
      toast.success("Ideas generated! 💰")
    } catch (err: any) {
      toast.error("Failed to generate ideas")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-full text-xs font-black uppercase tracking-wider">
          <DollarSign size={14} /> Monetize Your Skills
        </div>
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-400 to-emerald-400 bg-clip-text text-transparent">
          Side Hustle Generator
        </h1>
        <p className="text-gray-400 font-medium text-lg">
          Turn your 9-5 skills into profitable weekend projects. Let AI find your niche.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 relative">
        <div className="glass rounded-[32px] md:rounded-[40px] p-6 md:p-8 space-y-4 border-white/5 relative z-10 transition-all duration-300 hover:border-yellow-500/20">
          <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2 flex items-center gap-2">
            <Sparkles size={16} /> What are your core skills?
          </label>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. Graphic design, frontend development, writing, project management..."
            className="w-full h-[150px] bg-black/20 rounded-2xl p-6 border border-white/5 outline-none text-white resize-none font-medium placeholder:text-gray-600 focus:border-yellow-500/30 transition-all text-lg"
          />
          <button 
            onClick={handleGenerate}
            disabled={isProcessing}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-emerald-500 hover:from-yellow-600 hover:to-emerald-600 disabled:opacity-50 text-black font-black rounded-2xl transition-all shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-3 text-lg"
          >
            {isProcessing ? <Loader2 size={24} className="animate-spin text-black" /> : <Lightbulb size={24} />}
            {isProcessing ? "Finding Profitable Niches..." : "Generate Side Hustles 💡"}
          </button>
        </div>

        <AnimatePresence>
          {ideas && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[32px] md:rounded-[40px] p-6 md:p-8 space-y-4 border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 opacity-5 blur-[100px] pointer-events-none" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-xs font-black uppercase tracking-widest text-yellow-400 px-2 flex items-center gap-2">
                  <Lightbulb size={14} /> Recommended Hustles
                </span>
                <div className="flex gap-2">
                  <button onClick={() => {navigator.clipboard.writeText(ideas); toast.success("Copied!")}} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all bg-black/20"><Copy size={16} /></button>
                </div>
              </div>
              <div className="w-full min-h-[150px] whitespace-pre-wrap text-white font-medium leading-relaxed relative z-10 text-lg">
                {ideas}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
