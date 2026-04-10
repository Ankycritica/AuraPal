"use client"

import { useState } from "react"
import { Map, Sparkles, Loader2, CheckCircle2, ChevronRight, BookOpen, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

export default function CareerRoadmapPage() {
  const [current, setCurrent] = useState("")
  const [target, setTarget] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [roadmap, setRoadmap] = useState<any>(null)

  const handleGenerate = async () => {
    if (!current.trim() || !target.trim()) {
      toast.error("Please enter both your current and target roles.")
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          feature: "career_roadmap", 
          prompt: `Current Role: ${current}, Target Role: ${target}` 
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setRoadmap(JSON.parse(data.result.replace(/```json\n?|\n?```/g, "")))
      toast.success("Roadmap generated!")
    } catch (err: any) {
      toast.error("Cloud unavailable. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-black">AI Career Roadmap</h1>
        <p className="text-gray-400 font-medium">Get a step-by-step masterplan to transition from your current role to your dream position.</p>
      </div>

      <div className="glass p-10 rounded-[40px] space-y-8 shadow-2xl shadow-black/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2">Current Role</label>
            <input 
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="e.g. Junior Product Designer"
              className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:border-teal-500/50 transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2">Target Career Path</label>
            <input 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. Senior Product Manager"
              className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:border-teal-500/50 transition-all font-bold"
            />
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isProcessing}
          className="w-full py-5 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-500/50 text-white font-black rounded-3xl transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-3"
        >
          {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Map size={24} />}
          {isProcessing ? "Building Strategy..." : "Generate My Roadmap"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {roadmap && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="flex items-center justify-between px-4">
               <h2 className="text-xl font-black flex items-center gap-3">
                 <Sparkles className="text-teal-400" size={24} />
                 Your Strategic Masterplan
               </h2>
               <div className="flex items-center gap-2 text-gray-500">
                 <Clock size={16} />
                 <span className="text-sm font-bold uppercase tracking-widest">Est. {roadmap.estimated_months} Months</span>
               </div>
            </div>

            <div className="space-y-6 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-teal-500 before:to-transparent">
              {roadmap.milestones.map((ms: any, i: number) => (
                <div key={i} className="relative pl-24 group">
                  {/* Timeline Dot */}
                  <div className="absolute left-[30px] top-6 w-4 h-4 rounded-full bg-[#0a0f1e] border-2 border-teal-500 z-10 shadow-[0_0_10px_#14b8a6]" />
                  
                  <div className="glass p-8 rounded-[40px] space-y-6 group-hover:border-teal-500/30 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-1">Milestone {i+1} • {ms.weeks} Weeks</span>
                        <h3 className="text-2xl font-black">{ms.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-400 leading-relaxed">{ms.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-teal-400" />
                          Skills to acquire
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {ms.skills.map((s: string, j: number) => (
                            <span key={j} className="px-3 py-1 bg-teal-500/5 text-teal-400 text-xs font-bold rounded-lg border border-teal-500/10">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                          <BookOpen size={12} className="text-teal-400" />
                          Recommended Resources
                        </h4>
                        <ul className="space-y-1">
                          {ms.resources.map((r: string, j: number) => (
                            <li key={j} className="text-xs font-medium text-gray-400 flex items-center gap-2">
                              <ChevronRight size={12} className="text-teal-500" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-8">
               <button 
                 onClick={() => window.print()}
                 className="text-gray-500 hover:text-white font-bold text-sm tracking-widest uppercase underline underline-offset-8"
               >
                 Export Strategy PDF
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
