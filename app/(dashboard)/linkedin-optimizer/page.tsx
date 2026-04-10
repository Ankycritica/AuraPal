"use client"

import { useState } from "react"
import { Linkedin, Sparkles, Copy, Loader2, Save } from "lucide-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

export default function LinkedInOptimizerPage() {
  const [content, setContent] = useState("")
  const [section, setSection] = useState("Headline")
  const [result, setResult] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleOptimize = async () => {
    if (!content.trim()) {
      toast.error("Please paste your profile content first.")
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          feature: "linkedin_rewrite", 
          prompt: `Section: ${section}\n\nContent: ${content}` 
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.result)
      toast.success("Optimized for recruiting algorithms!")
    } catch (err: any) {
      toast.error(err.message || "Failed to optimize")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
      <div className="space-y-2 text-center">
        <div className="w-16 h-16 bg-blue-500/10 rounded-[20px] flex items-center justify-center text-blue-400 mx-auto mb-6">
          <Linkedin size={32} />
        </div>
        <h1 className="text-4xl font-black">LinkedIn Profile Optimizer</h1>
        <p className="text-gray-400 font-medium">Maximize your search visibility and professional impact for recruiter algorithms.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="glass p-10 rounded-[40px] space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2">Section Type</label>
              <select 
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all font-bold appearance-none text-white"
              >
                {["Headline", "About (Summary)", "Work Experience", "Skills List"].map((s) => (
                  <option key={s} value={s} className="bg-[#0a0f1e]">{s}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleOptimize}
              disabled={isProcessing}
              className="w-full py-5 bg-[#0077b5] hover:bg-[#0077b5]/90 disabled:bg-[#0077b5]/50 text-white font-black rounded-3xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
            >
              {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
              {isProcessing ? "Optimizing Profile..." : "Rewrite Section"}
            </button>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2">Current Content</label>
             <textarea 
               value={content}
               onChange={(e) => setContent(e.target.value)}
               placeholder={`Paste your current ${section} here...`}
               className="w-full h-[200px] bg-white/5 border border-white/5 p-6 rounded-3xl outline-none focus:border-blue-500/50 transition-all text-sm font-medium resize-none leading-relaxed"
             />
          </div>
        </div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-10 rounded-[40px] border-blue-500/20 bg-blue-500/5 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black flex items-center gap-2">
                <Sparkles size={18} className="text-blue-400" />
                AI-Optimized Version
              </h2>
              <button 
                onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold border border-white/5 transition-all"
              >
                <Copy size={14} />
                Copy
              </button>
            </div>
            <div className="p-8 rounded-3xl bg-black/20 text-white font-medium leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 text-xs font-bold text-gray-500">
               <div className="flex items-center gap-2 text-blue-400">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                 Keyword Density Increased
               </div>
               <div className="flex items-center gap-2 text-blue-400">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                 Recruiter Visibility Improved
               </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
