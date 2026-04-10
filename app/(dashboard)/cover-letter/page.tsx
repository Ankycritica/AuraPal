"use client"

import { useState } from "react"
import { Mail, Sparkles, Copy, Download, Loader2, Target } from "lucide-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import jsPDF from "jspdf"

export default function CoverLetterPage() {
  const [jobDescription, setJobDescription] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [result, setResult] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please provide the job description.")
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          feature: "cover_letter", 
          prompt: `Resume: ${resumeText}\n\nJob Description: ${jobDescription}` 
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.result)
      toast.success("Cover letter generated!")
    } catch (err: any) {
      toast.error(err.message || "Failed to generate")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    const text = result
    const margin = 15
    const pageWidth = doc.internal.pageSize.getWidth()
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2)
    doc.text(lines, margin, 20)
    doc.save("tailored_cover_letter.pdf")
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-black">Cover Letter Generator</h1>
        <p className="text-gray-400 font-medium">Create a personalized, compelling cover letter that highlights your fit for a specific role.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Panel */}
        <div className="space-y-6">
          <div className="glass rounded-[40px] p-8 space-y-6">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Target size={20} className="text-teal-400" />
              Target Job
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2">Job Description</label>
                <textarea 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here (title, requirements, etc.)..."
                  className="w-full h-[200px] bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:border-teal-500/50 transition-all text-sm resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-2">Your Resume Content (Optional)</label>
                <textarea 
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume bio or full text to help AI customize the letter..."
                  className="w-full h-[150px] bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:border-teal-500/50 transition-all text-sm resize-none"
                />
              </div>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isProcessing}
              className="w-full py-5 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-500/50 text-white font-black rounded-3xl transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-3"
            >
              {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
              {isProcessing ? "Crafting Your Letter..." : "Generate Cover Letter"}
            </button>
          </div>
        </div>

        {/* Result Panel */}
        <div className="space-y-6">
          <div className="glass rounded-[40px] p-8 border-teal-500/20 bg-teal-500/5 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black flex items-center gap-2">
                <Mail size={20} className="text-teal-400" />
                Your Result
              </h2>
              {result && (
                <div className="flex gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 transition-all"><Copy size={18} /></button>
                  <button onClick={downloadPDF} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 transition-all"><Download size={18} /></button>
                </div>
              )}
            </div>
            
            <div className="flex-1 text-sm font-medium leading-relaxed text-white whitespace-pre-wrap">
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="h-4 bg-white/10 rounded-full animate-pulse w-3/4" />
                  <div className="h-4 bg-white/10 rounded-full animate-pulse w-1/2" />
                  <div className="h-4 bg-white/10 rounded-full animate-pulse w-5/6" />
                  <div className="h-4 bg-white/10 rounded-full animate-pulse w-full" />
                  <div className="h-4 bg-white/10 rounded-full animate-pulse w-4/5" />
                </div>
              ) : result ? (
                result
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-600">
                  <div className="p-6 rounded-3xl bg-white/5">
                    <Mail size={48} />
                  </div>
                  <p className="max-w-[200px]">Fill in the details to generate your tailored cover letter.</p>
                </div>
              )}
            </div>

            {result && (
              <div className="pt-8 flex justify-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Always review AI-generated content before sending.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
