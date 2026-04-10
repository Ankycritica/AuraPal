"use client"

import { useState } from "react"
import { Sparkles, FileText, Download, Copy, Loader2, Save } from "lucide-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import jsPDF from "jspdf"
import { cn } from "@/lib/utils"

export default function ResumeBuilderPage() {
  const [inputText, setInputText] = useState("")
  const [rewrittenText, setRewrittenText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("paste")

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      toast.error("Please paste your resume content first.")
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          feature: "resume_rewrite", 
          prompt: inputText 
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setRewrittenText(data.result)
      setActiveTab("ai")
      toast.success("Resume optimized!")
    } catch (err: any) {
      toast.error(err.message || "Failed to rewrite")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    const text = rewrittenText || inputText
    const margin = 15
    const pageWidth = doc.internal.pageSize.getWidth()
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2)
    doc.text(lines, margin, 20)
    doc.save("optimized_resume.pdf")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-black">AI Resume Builder</h1>
        <p className="text-gray-400 font-medium">Paste your existing resume sections and let AI handle the heavy lifting of optimization.</p>
      </div>

      <div className="glass p-2 rounded-2xl flex items-center gap-1 mb-8 max-w-sm">
        <TabButton active={activeTab === "paste"} onClick={() => setActiveTab("paste")}>1. Paste Content</TabButton>
        <TabButton active={activeTab === "ai"} onClick={() => setActiveTab("ai")}>2. AI Rewrite</TabButton>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === "paste" ? (
          <div className="space-y-6">
            <div className="glass rounded-[40px] p-8 space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2 block">Resume Text (Summary, Experience, or Full)</label>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your current resume content here..."
                className="w-full h-[400px] bg-transparent border-none outline-none text-white resize-none custom-scrollbar font-medium placeholder:text-gray-700"
              />
            </div>
            <button 
              onClick={handleRewrite}
              disabled={isProcessing}
              className="w-full py-5 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-500/50 text-white font-black rounded-3xl transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-3"
            >
              {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
              {isProcessing ? "AuraPal is Rewriting..." : "Optimize Resume with AI"}
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-[40px] p-8 space-y-4 border-teal-500/20 bg-teal-500/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-teal-400 px-2 flex items-center gap-2">
                  <Sparkles size={14} />
                  AI-Optimized Result
                </span>
                <div className="flex gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(rewrittenText); toast.success("Copied!"); }} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 transition-all"><Copy size={18} /></button>
                </div>
              </div>
              <div className="w-full h-[400px] overflow-y-auto whitespace-pre-wrap text-white custom-scrollbar font-medium leading-relaxed">
                {rewrittenText || "Click rewrite to see results here..."}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={downloadPDF}
                className="py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-3xl border border-white/10 transition-all flex items-center justify-center gap-3"
              >
                <Download size={24} />
                Download as PDF
              </button>
              <button 
                 onClick={() => { toast.success("Feature coming soon!"); }}
                className="py-5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 font-black rounded-3xl border border-teal-500/20 transition-all flex items-center justify-center gap-3"
              >
                <Save size={24} />
                Save to Profile
              </button>
            </div>
            
            <button 
              onClick={() => setActiveTab("paste")}
              className="w-full text-center text-gray-500 text-sm font-bold hover:text-white transition-colors"
            >
              &larr; Back to Editor
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 py-2 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
        active ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" : "text-gray-500 hover:text-gray-300"
      )}
    >
      {children}
    </button>
  )
}
