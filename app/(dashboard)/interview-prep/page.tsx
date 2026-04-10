"use client"

import { useState } from "react"
import { MessageSquare, Sparkles, Send, Loader2, Star, CheckCircle2, ChevronRight, Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

export default function InterviewPrepPage() {
  const [role, setRole] = useState("")
  const [company, setCompany] = useState("")
  const [type, setType] = useState("Behavioral")
  
  const [isStarted, setIsStarted] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)

  const startInterview = async () => {
    if (!role.trim()) {
      toast.error("Please enter the target role.")
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          feature: "interview_question", 
          prompt: `Role: ${role}, Company: ${company}, Type: ${type}` 
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setQuestion(data.result)
      setIsStarted(true)
      setFeedback(null)
      setAnswer("")
    } catch (err: any) {
      toast.error(err.message || "Failed to start interview")
    } finally {
      setIsProcessing(false)
    }
  }

  const scoreAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer first.")
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          feature: "interview_score", 
          prompt: `Question: ${question}\n\nAnswer: ${answer}` 
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setFeedback(JSON.parse(data.result.replace(/```json\n?|\n?```/g, "")))
    } catch (err: any) {
      toast.error("Failed to score answer. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-black">AI Interview Simulator</h1>
        <p className="text-gray-400 font-medium">Practice realistic role-specific questions and get instant feedback on your performance.</p>
      </div>

      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-10 rounded-[40px] space-y-8 shadow-2xl shadow-black/40"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2">Target Role</label>
                <input 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:border-teal-500/50 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2">Company (Optional)</label>
                <input 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:border-teal-500/50 transition-all font-bold"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2">Question Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Behavioral", "Technical", "Situational", "System Design"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={cn(
                        "py-3 rounded-xl text-xs font-bold transition-all",
                        type === t ? "bg-teal-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={startInterview}
              disabled={isProcessing}
              className="w-full py-5 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-500/50 text-white font-black rounded-3xl transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-3"
            >
              {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Play size={24} />}
              {isProcessing ? "Preparing Session..." : "Start Mock Interview"}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="session"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Question Panel */}
            <div className="glass p-10 rounded-[40px] border-teal-500/20 bg-teal-500/5 space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <MessageSquare size={120} />
               </div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-widest">
                 <Sparkles size={12} />
                 Interviewer Asking
               </div>
               <h3 className="text-2xl font-black leading-tight text-white relative z-10">{question}</h3>
            </div>

            {/* Feedback Panel */}
            {feedback && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="glass p-10 rounded-[40px] bg-white/5 space-y-8 border-white/10"
               >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Session Score</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-black text-teal-400">{feedback.score}%</span>
                        <div className="flex gap-1 text-amber-500">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} size={18} fill={i < feedback.star_rating ? "currentColor" : "none"} />
                           ))}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={startInterview}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-sm font-bold flex items-center gap-2 transition-all"
                    >
                      Next Question
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h5 className="text-sm font-black flex items-center gap-2 text-teal-400">
                        <CheckCircle2 size={16} />
                        Detailed Feedback
                      </h5>
                      <p className="text-sm text-gray-400 leading-relaxed font-medium">{feedback.feedback}</p>
                    </div>
                    <div className="space-y-4">
                      <h5 className="text-sm font-black flex items-center gap-2 text-amber-500">
                        <Sparkles size={16} />
                        Improvement Tips
                      </h5>
                      <p className="text-sm text-gray-400 leading-relaxed font-medium">{feedback.improvement}</p>
                    </div>
                  </div>
               </motion.div>
            )}

            {/* Answer Panel */}
            {!feedback && (
              <div className="glass p-10 rounded-[40px] space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2">Your Answer</label>
                  <textarea 
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your response or use voice-to-text..."
                    className="w-full h-[200px] bg-white/5 border border-white/5 p-6 rounded-3xl outline-none focus:border-teal-500/50 transition-all text-lg font-medium resize-none leading-relaxed"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <button 
                    onClick={() => setIsStarted(false)}
                    className="text-gray-500 hover:text-white font-bold text-sm"
                  >
                    End Session
                  </button>
                  <button 
                    onClick={scoreAnswer}
                    disabled={isProcessing}
                    className="px-10 py-5 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-500/50 text-white font-black rounded-3xl transition-all shadow-xl shadow-teal-500/20 flex items-center gap-3"
                  >
                    {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                    {isProcessing ? "Analyzing Performance..." : "Submit Answer"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
