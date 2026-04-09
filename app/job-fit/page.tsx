"use client";

import React, { useState } from 'react';
import { Target, Sparkles, ArrowLeft, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function JobFitPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const analyzeFit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({ 
          feature: 'job_fit', 
          prompt: `Resume: ${(e.target as any).resume.value}, JD: ${(e.target as any).jd.value}`
        }),
      });
      const data = await response.json();
      setResult(JSON.parse(data.result));
    } catch (err) {
      toast.error('Analysis failed. Ensure the AI returns valid JSON.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Job Fit Analyzer</h1>
          <p className="text-gray-400 mt-1">Deep ATS match analysis and skill gap detection</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={analyzeFit} className="glass p-8 rounded-2xl space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Job Description</label>
                <textarea name="jd" required className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all h-32" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Your Resume</label>
                <textarea name="resume" required className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all h-32" />
              </div>
            </div>
            <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
              Analyze Match
            </button>
          </form>

          <div className="space-y-6">
            {result ? (
              <div className="glass p-8 rounded-2xl animate-fade-in border-indigo-500/20 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Analysis Report</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Score</span>
                    <div className="text-3xl font-black text-indigo-400">{result.score}%</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Matched Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matched_keywords?.map((kw: string, i: number) => (
                      <span key={i} className="bg-indigo-600/10 text-indigo-400 text-xs px-3 py-1 rounded-full font-bold">{kw}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords?.map((kw: string, i: number) => (
                      <span key={i} className="bg-red-400/10 text-red-400 text-xs px-3 py-1 rounded-full font-bold">{kw}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gap Analysis</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{result.gap_analysis}</p>
                </div>
              </div>
            ) : (
              <div className="glass p-8 rounded-2xl h-full flex flex-col items-center justify-center text-center opacity-50 grayscale">
                <Target size={64} className="mb-4 text-gray-600" />
                <h3 className="text-lg font-bold">Awaiting Analysis</h3>
                <p className="text-sm text-gray-500 max-w-[200px] mt-2">Upload your resume and the job description to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
