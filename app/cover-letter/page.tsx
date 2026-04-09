"use client";

import React, { useState } from 'react';
import { Mail, Sparkles, Copy, Download, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CoverLetterPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  
  const generateLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({ 
          feature: 'cover_letter', 
          prompt: (e.target as any).jd.value, 
          context: (e.target as any).resume.value 
        }),
      });
      const data = await response.json();
      setResult(data.result);
      toast.success('Cover letter generated!');
    } catch (err) {
      toast.error('Failed to generate letter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Cover Letter Generator</h1>
          <p className="text-gray-400 mt-1">Tailored letters matching your resume to any job posting</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <form onSubmit={generateLetter} className="glass p-8 rounded-2xl space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Target Job Description</label>
                <textarea 
                  name="jd"
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all h-32" 
                  placeholder="Paste the job description here..." 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Your Resume Content</label>
                <textarea 
                  name="resume"
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all h-32" 
                  placeholder="Paste your resume text here..." 
                />
              </div>
            </div>
            
            <button 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Generating Letter...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Write Cover Letter
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="glass p-8 rounded-2xl space-y-6 animate-fade-in bg-white/5 border-indigo-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Tailored Letter</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied!'); }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>
              <div className="bg-white/5 p-6 rounded-xl border border-white/5 leading-relaxed text-gray-300 whitespace-pre-wrap">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
