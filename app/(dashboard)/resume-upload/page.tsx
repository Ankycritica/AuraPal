"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { 
  Upload, 
  FileUp, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Copy, 
  RefreshCw, 
  Save,
  Check
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import jsPDF from "jspdf"

export default function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  
  const [originalText, setOriginalText] = useState("")
  const [improvedText, setImprovedText] = useState("")
  const [atsScore, setAtsScore] = useState<any>(null)
  const [isSaved, setIsSaved] = useState(false)

  const onDrop = async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max 5MB.")
      return
    }
    setFile(selectedFile)
    startProcessing(selectedFile)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  })

  const startProcessing = async (selectedFile: File) => {
    setParsing(true)
    setAtsScore(null)
    setImprovedText("")
    
    try {
      // 1. Parse Text
      const formData = new FormData()
      formData.append("file", selectedFile)
      const parseRes = await fetch("/api/resume/parse", { method: "POST", body: formData })
      const parseData = await parseRes.json()
      if (parseData.error) throw new Error(parseData.error)
      
      setOriginalText(parseData.text)
      setParsing(false)
      setAnalyzing(true)

      // 2. Improve & Score Simultaneously
      const [improveRes, scoreRes] = await Promise.all([
        fetch("/api/resume/improve", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: parseData.text }) 
        }),
        fetch("/api/resume/ats-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: parseData.text })
        })
      ])

      const improveData = await improveRes.json()
      const scoreData = await scoreRes.json()

      if (improveData.improved) setImprovedText(improveData.improved)
      if (scoreData) setAtsScore(scoreData)
      
      toast.success("Analysis complete!")
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
      setFile(null)
    } finally {
      setParsing(false)
      setAnalyzing(false)
    }
  }

  const saveToSupabase = async () => {
    if (isSaved) return
    try {
      const res = await fetch("/api/resume/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Optimized: ${file?.name}`,
          originalText,
          improvedText: improvedText || originalText,
          atsScore,
          fileName: file?.name
        })
      })
      if (!res.ok) throw new Error("Failed to save")
      setIsSaved(true)
      toast.success("Saved to My Resumes!")
    } catch (err) {
      toast.error("Failed to save")
    }
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    const text = improvedText || originalText
    const margin = 15
    const pageWidth = doc.internal.pageSize.getWidth()
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2)
    doc.text(lines, margin, 20)
    doc.save(`${file?.name?.replace(/\.[^/.]+$/, "")}_aurapal.pdf`)
  }

  const scoreColor = (score: number) => {
    if (score <= 40) return "text-red-500"
    if (score <= 70) return "text-amber-500"
    if (score <= 85) return "text-green-500"
    return "text-teal-400"
  }

  const scoreBg = (score: number) => {
    if (score <= 40) return "bg-red-500"
    if (score <= 70) return "bg-amber-500"
    if (score <= 85) return "bg-green-500"
    return "bg-teal-400"
  }

  const scoreLabel = (score: number) => {
    if (score <= 40) return "Needs Work"
    if (score <= 70) return "Good Start"
    if (score <= 85) return "Strong"
    return "Excellent"
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-black">Resume Scan & Score</h1>
        <p className="text-gray-400 font-medium">Upload your resume to see how it matches ATS filters and get an AI-powered upgrade.</p>
      </div>

      {/* Upload Zone */}
      {!file ? (
        <div 
          {...getRootProps()} 
          className={cn(
            "relative group cursor-pointer aspect-[21/9] rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500",
            isDragActive 
              ? "border-teal-400 bg-teal-400/5 scale-[0.99]" 
              : "border-gray-800 hover:border-teal-500/50 bg-[#0d1224]"
          )}
        >
          <input {...getInputProps()} />
          <div className="p-8 rounded-full bg-white/5 mb-6 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-white transition-all duration-500 text-gray-500">
            <Upload size={48} />
          </div>
          <div className="text-center space-y-2">
            <p className="text-2xl font-black">Drag & drop your resume here</p>
            <p className="text-gray-500 font-medium">or click to browse — PDF, DOCX, TXT (max 5MB)</p>
          </div>
          {isDragActive && (
            <div className="absolute inset-0 bg-teal-400/10 rounded-[40px] animate-pulse" />
          )}
        </div>
      ) : (
        <div className="glass p-6 rounded-3xl flex items-center justify-between animate-fade-in shadow-2xl shadow-black/40">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-teal-500/10 rounded-2xl text-teal-400">
              <FileUp size={24} />
            </div>
            <div>
              <p className="font-bold text-lg">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          {!analyzing && !parsing && (
            <button 
              onClick={() => { setFile(null); setAtsScore(null); setImprovedText(""); setOriginalText(""); }}
              className="p-3 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all text-gray-500"
            >
              <X size={24} />
            </button>
          )}
        </div>
      )}

      {/* Analysis Results */}
      <AnimatePresence>
        {(parsing || analyzing) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="glass p-12 rounded-[40px] text-center space-y-6">
              <Loader2 className="w-16 h-16 text-teal-400 animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black">
                  {parsing ? "Parsing your resume..." : "AI is analyzing & improving..."}
                </h3>
                <p className="text-gray-400 font-medium">This usually takes around 10-15 seconds.</p>
              </div>
            </div>
          </motion.div>
        )}

        {atsScore && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* ATS Score Card */}
            <div className="glass p-10 rounded-[40px] grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="text-center space-y-4">
                <div className="relative inline-flex flex-col items-center justify-center">
                  <svg className="w-48 h-48 -rotate-90">
                    <circle 
                      cx="96" cy="96" r="80" 
                      fill="none" stroke="currentColor" 
                      strokeWidth="12" className="text-white/5" 
                    />
                    <circle 
                      cx="96" cy="96" r="80" 
                      fill="none" stroke="currentColor" 
                      strokeWidth="12" 
                      strokeDasharray={502.6}
                      strokeDashoffset={502.6 - (502.6 * atsScore.overall) / 100}
                      className={scoreColor(atsScore.overall)} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black">{atsScore.overall}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">ATS Score</span>
                  </div>
                </div>
                <div>
                  <div className={cn("text-xl font-black", scoreColor(atsScore.overall))}>
                    {scoreLabel(atsScore.overall)}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <ScoreBar label="Keywords" score={atsScore.keywords} />
                  <ScoreBar label="Formatting" score={atsScore.format} />
                  <ScoreBar label="Impact Scope" score={atsScore.impact} />
                  <ScoreBar label="Readability" score={88} /> {/* Calculated/Static */}
                </div>

                <div className="space-y-4 pt-4">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500">Missing Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {atsScore.missing_keywords.map((kw: string, i: number) => (
                      <span key={i} className="px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions & Strengths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-[40px] space-y-6">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <AlertCircle size={20} className="text-amber-500" />
                  Improvement Tips
                </h3>
                <ul className="space-y-4">
                  {atsScore.suggestions.map((s: string, i: number) => (
                    <li key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 text-sm font-medium text-gray-300">
                      <span className="text-amber-500 font-bold">{i+1}.</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass p-8 rounded-[40px] space-y-6">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-teal-400" />
                  Major Strengths
                </h3>
                <ul className="space-y-4">
                  {atsScore.strengths.map((s: string, i: number) => (
                    <li key={i} className="flex gap-4 p-4 rounded-2xl bg-teal-500/5 text-sm font-medium text-gray-300">
                      <CheckCircle2 className="text-teal-400 shrink-0" size={18} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Comparison Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-bold text-gray-500 uppercase tracking-widest text-xs">Your Original Resume</h3>
                </div>
                <div className="glass p-8 rounded-[40px] h-[600px] overflow-y-auto text-sm text-gray-400 whitespace-pre-wrap leading-relaxed custom-scrollbar border-white/5">
                  {originalText}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-bold text-teal-400 uppercase tracking-widest text-xs">AI-Improved Version</h3>
                </div>
                <div className="glass p-8 rounded-[40px] h-[600px] overflow-y-auto text-sm text-white whitespace-pre-wrap leading-relaxed custom-scrollbar border-teal-500/20 bg-teal-500/5 shadow-2xl shadow-teal-500/10 relative">
                  {!improvedText ? (
                    <div className="space-y-6">
                      <div className="h-4 bg-white/5 rounded-full animate-pulse w-3/4" />
                      <div className="h-4 bg-white/5 rounded-full animate-pulse w-1/2" />
                      <div className="h-4 bg-white/5 rounded-full animate-pulse w-5/6" />
                      <div className="h-4 bg-white/5 rounded-full animate-pulse w-2/3" />
                      <div className="h-4 bg-white/5 rounded-full animate-pulse w-4/5" />
                    </div>
                  ) : (
                    improvedText
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
              <button 
                onClick={downloadPDF}
                className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-teal-500/20 flex items-center gap-3"
              >
                <Download size={20} />
                Download PDF
              </button>
              <button 
                onClick={() => { navigator.clipboard.writeText(improvedText || originalText); toast.success("Copied to clipboard!"); }}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center gap-3"
              >
                <Copy size={20} />
                Copy Text
              </button>
              <button 
                onClick={() => startProcessing(file!)}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center gap-3"
              >
                <RefreshCw size={20} />
                Retake Pass
              </button>
              <button 
                onClick={saveToSupabase}
                disabled={isSaved}
                className={cn(
                  "px-8 py-4 font-bold rounded-2xl border transition-all flex items-center gap-3",
                  isSaved 
                    ? "bg-teal-500/20 border-teal-500/30 text-teal-400 cursor-default" 
                    : "bg-white/5 hover:bg-white/10 text-white border-white/10"
                )}
              >
                {isSaved ? <Check size={20} /> : <Save size={20} />}
                {isSaved ? "Saved" : "Save to My Resumes"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ScoreBar({ label, score }: { label: string, score: number }) {
  const getBarColor = (s: number) => {
    if (s <= 40) return "bg-red-500"
    if (s <= 70) return "bg-amber-500"
    if (s <= 85) return "bg-green-500"
    return "bg-teal-400"
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-black">{score}%</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full shadow-[0_0_10px_currentColor]", getBarColor(score))}
        />
      </div>
    </div>
  )
}
