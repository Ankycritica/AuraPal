"use client";

import React, { useState } from 'react';
import { Map, Sparkles, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CareerRoadmapPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const generateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({ 
          feature: 'career_roadmap', 
          prompt: `Current: ${(e.target as any).current.value}, Target: ${(e.target as any).target.value}`
        }),
      });
      const data = await response.json();
      setResult(JSON.parse(data.result));
    } catch (err) {
      toast.error('Generation failed');
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
          <h1 className="text-3xl font-extrabold tracking-tight">Career Roadmap</h1>
          <p className="text-gray-400 mt-1">Step-by-step masterplan to reach your target role</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <form onSubmit={generateRoadmap} className="glass p-8 rounded-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Current Role</label>
                <input type="text" name="current" required className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-medium" placeholder="e.g. Junior Developer" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Target Role</label>
                <input type="text" name="target" required className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-medium" placeholder="e.g. Staff Engineer" />
              </div>
            </div>
            
            <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <Map size={20} />}
              Generate My Roadmap
            </button>
          </form>

          {result && (
            <div className="space-y-6 animate-fade-in">
              {result.milestones?.map((m: any, idx: number) => (
                <div key={idx} className="glass p-8 rounded-2xl border-l-4 border-l-indigo-500 relative">
                  <div className="absolute top-8 left-0 -translate-x-1/2 w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl font-bold tracking-tight">{m.title}</h3>
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-600/10 px-3 py-1 rounded-full">{m.weeks} WEEKS</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Skills to Master</h4>
                      <ul className="space-y-2">
                        {m.skills?.map((s: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle2 size={14} className="text-indigo-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Top Resources</h4>
                      <ul className="space-y-2 text-sm text-gray-400">
                        {m.resources?.map((r: string, i: number) => (
                          <li key={i}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
