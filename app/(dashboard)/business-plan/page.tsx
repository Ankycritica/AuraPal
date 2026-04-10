"use client"
import { useState } from "react"
import { Briefcase, Loader2, Sparkles, Copy, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export default function BusinessPlanPage() {
  const [inputText, setInputText] = useState("")
  const [plan, setPlan] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter a business idea first!")
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature: "business_plan", prompt: inputText }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setPlan(data.result)
      toast.success("Business plan generated! 🏢")
    } catch (err: any) {
      toast.error("Failed to generate plan")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-full text-xs font-black uppercase tracking-wider">
          <FileText size={14} /> Startup Builder
        </div>
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          B2B Business Plan
        </h1>
        <p className="text-gray-400 font-medium text-lg">
          Turn your vague SaaS ideas into structured business plans in 10 seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 relative">
        <div className="glass rounded-[32px] md:rounded-[40px] p-6 md:p-8 space-y-4 border-white/5 relative z-10 transition-all duration-300 hover:border-blue-500/20">
          <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2 flex items-center gap-2">
            <Sparkles size={16} /> Describe your idea
          </label>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. An AI that automatically applies to jobs based on your exact profile and skills..."
            className="w-full h-[150px] bg-black/20 rounded-2xl p-6 border border-white/5 outline-none text-white resize-none font-medium placeholder:text-gray-600 focus:border-blue-500/30 transition-all text-lg"
          />
          <button 
            onClick={handleGenerate}
            disabled={isProcessing}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 text-lg"
          >
            {isProcessing ? <Loader2 size={24} className="animate-spin text-white" /> : <Briefcase size={24} />}
            {isProcessing ? "Analyzing Market..." : "Generate Business Plan 🏢"}
          </button>
        </div>

        <AnimatePresence>
          {plan && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[32px] md:rounded-[40px] p-6 md:p-8 space-y-4 border-blue-500/20 bg-blue-500/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-5 blur-[100px] pointer-events-none" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-xs font-black uppercase tracking-widest text-blue-400 px-2 flex items-center gap-2">
                  <Briefcase size={14} /> The Plan
                </span>
                <div className="flex gap-2">
                  <button onClick={() => {navigator.clipboard.writeText(plan); toast.success("Copied!")}} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all bg-black/20"><Copy size={16} /></button>
                </div>
              </div>
              <div className="w-full min-h-[150px] whitespace-pre-wrap text-white font-medium leading-relaxed relative z-10 text-lg">
                {plan}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
