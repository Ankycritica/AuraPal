"use client"

import { useState } from "react"
import { Target, Sparkles, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

export default function JobFitPage() {
  const [resume, setResume] = useState("")
  const [jd, setJd] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!resume.trim() || !jd.trim()) {
      toast.error("Please provide both your resume and the job description.")
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          feature: "job_fit", 
          prompt: `Resume: ${resume}\n\nJob Description: ${jd}` 
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(JSON.parse(data.result.replace(/```json\n?|\n?```/g, "")))
      toast.success("Analysis complete!")
    } catch (err: any) {
      toast.error("Failed to analyze. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-black">Job Fit Analyzer</h1>
        <p className="text-gray-400 font-medium">See how well your resume matches a specific job description and identify critical gaps.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Area */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[40px] space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2">1. Your Resume</label>
              <textarea 
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full h-[250px] bg-white/5 border border-white/5 p-4 rounded-3xl outline-none focus:border-teal-500/50 transition-all text-sm resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2">2. Job Description</label>
              <textarea 
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the target job description here..."
                className="w-full h-[250px] bg-white/5 border border-white/5 p-4 rounded-3xl outline-none focus:border-teal-500/50 transition-all text-sm resize-none"
              />
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={isProcessing}
              className="w-full py-5 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-500/50 text-white font-black rounded-3xl transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-3"
            >
              {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Target size={24} />}
              {isProcessing ? "Analyzing Match..." : "Calculate Fit Score"}
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {!result && !isProcessing ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass p-12 rounded-[40px] h-full flex flex-col items-center justify-center text-center space-y-6 border-white/5 grayscale opacity-50"
              >
                <div className="p-8 rounded-full bg-white/5">
                  <Target size={64} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Ready to analyze</h3>
                  <p className="text-gray-500 max-w-[280px]">Paste your details and click the button to see your match score.</p>
                </div>
              </motion.div>
            ) : isProcessing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass p-12 rounded-[40px] h-full flex flex-col items-center justify-center text-center space-y-6"
              >
                <Loader2 className="w-16 h-16 text-teal-400 animate-spin" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Comparing Resume to JD</h3>
                  <p className="text-gray-500">Checking keywords, skills, and experience match...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Score Card */}
                <div className="glass p-10 rounded-[40px] border-teal-500/20 bg-teal-500/5 text-center space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Match Probability</div>
                  <div className={cn("text-7xl font-black", result.score >= 70 ? "text-teal-400" : result.score >= 40 ? "text-amber-500" : "text-red-500")}>
                    {result.score}%
                  </div>
                  <p className="text-sm text-gray-400 font-medium px-8">{result.gap_analysis}</p>
                </div>

                {/* Keyword Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass p-6 rounded-3xl space-y-4 border-green-500/10">
                    <h4 className="text-xs font-black uppercase tracking-widest text-green-500 flex items-center gap-2">
                      <CheckCircle2 size={14} />
                      Matched
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.matched_keywords.map((kw: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-lg border border-green-500/10">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="glass p-6 rounded-3xl space-y-4 border-red-500/10">
                    <h4 className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                      <XCircle size={14} />
                      Missing
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_keywords.map((kw: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold rounded-lg border border-red-500/10">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="glass p-8 rounded-[40px] space-y-6">
                  <h4 className="text-sm font-black flex items-center gap-2">
                    <AlertCircle size={18} className="text-teal-400" />
                    How to bridge the gap
                  </h4>
                  <div className="space-y-3">
                    {result.recommendations.map((rec: string, i: number) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 text-sm font-medium text-gray-300">
                        <span className="text-teal-400 font-bold">{i+1}.</span>
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
