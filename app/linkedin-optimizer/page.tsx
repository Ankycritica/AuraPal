"use client";

import React, { useState } from 'react';
import { Linkedin, Sparkles, Copy, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LinkedInOptimizerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  
  const optimize = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({ 
          feature: 'linkedin_rewrite', 
          prompt: (e.target as any).profile.value
        }),
      });
      const data = await response.json();
      setResult(data.result);
      toast.success('Optimized!');
    } catch (err) {
      toast.error('Optimization failed');
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
          <h1 className="text-3xl font-extrabold tracking-tight">LinkedIn Optimizer</h1>
          <p className="text-gray-400 mt-1">Maximize recruiter visibility and social influence</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <form onSubmit={optimize} className="glass p-8 rounded-2xl space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Section Content (Headline, About, or Experience)</label>
              <textarea 
                name="profile"
                required
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all h-48" 
                placeholder="Paste your current LinkedIn section here..." 
              />
            </div>
            
            <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              Optimize for Recruiters
            </button>
          </form>

          {result && (
            <div className="glass p-8 rounded-2xl space-y-6 animate-fade-in border-indigo-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Optimized Version</h2>
                <button onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied!'); }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Copy size={20} />
                </button>
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
