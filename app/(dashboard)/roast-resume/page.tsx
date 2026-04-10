"use client"
import { useState } from "react"
import { Flame, Loader2, UploadCloud, Copy, RefreshCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export default function RoastResumePage() {
  const [inputText, setInputText] = useState("")
  const [roast, setRoast] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleRoast = async () => {
    if (!inputText.trim()) {
      toast.error("Please paste your resume first!")
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature: "roast_resume", prompt: inputText }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setRoast(data.result)
      toast.success("Resume roasted! 🔥")
    } catch (err: any) {
      toast.error("Failed to generate roast")
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roast)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-xs font-black uppercase tracking-wider">
          <Flame size={14} /> Viral Feature
        </div>
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          Roast My Resume
        </h1>
        <p className="text-gray-400 font-medium text-lg">
          Get brutal, honest feedback on your resume. Not for the faint of heart. 🌶️
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 relative">
        <div className="glass rounded-[32px] md:rounded-[40px] p-6 md:p-8 space-y-4 border-white/5 relative z-10 transition-all duration-300 hover:border-red-500/20">
          <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2 flex items-center gap-2">
            <UploadCloud size={16} /> Paste Your Resume
          </label>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your resume content here (Summary, Experience, Skills)..."
            className="w-full h-[300px] bg-black/20 rounded-2xl p-6 border border-white/5 outline-none text-white resize-none font-medium placeholder:text-gray-600 focus:border-red-500/30 transition-all"
          />
          <button 
            onClick={handleRoast}
            disabled={isProcessing}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 text-lg"
          >
            {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Flame size={24} />}
            {isProcessing ? "Cooking up a roast..." : "Roast It 🔥"}
          </button>
        </div>

        <AnimatePresence>
          {roast && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[32px] md:rounded-[40px] p-6 md:p-8 space-y-4 border-red-500/20 bg-red-500/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 opacity-5 blur-[100px] pointer-events-none" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-xs font-black uppercase tracking-widest text-red-400 px-2 flex items-center gap-2">
                  <Flame size={14} /> The Verdict
                </span>
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all bg-black/20"><Copy size={16} /></button>
                  <button onClick={() => {setRoast(""); setInputText("");}} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all bg-black/20"><RefreshCcw size={16} /></button>
                </div>
              </div>
              <div className="w-full min-h-[150px] whitespace-pre-wrap text-white font-medium leading-relaxed relative z-10 text-lg md:text-xl">
                {roast}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
