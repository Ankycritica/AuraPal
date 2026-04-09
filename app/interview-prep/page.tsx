"use client";

import React, { useState } from 'react';
import { Mic2, Sparkles, Send, ArrowLeft, Loader2, Play } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function InterviewPrepPage() {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  
  const startSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({ 
          feature: 'interview_question', 
          prompt: `Role: ${(e.target as any).role.value}, Company: ${(e.target as any).company.value}`
        }),
      });
      const data = await response.json();
      setQuestion(data.result);
    } catch (err) {
      toast.error('Failed to start interview');
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
          <h1 className="text-3xl font-extrabold tracking-tight">Interview Simulator</h1>
          <p className="text-gray-400 mt-1">Realistic mock interviews with senior hiring manager feedback</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {!question ? (
            <form onSubmit={startSession} className="glass p-8 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Target Role</label>
                  <input type="text" name="role" required className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" placeholder="e.g. Senior Frontend Engineer" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Company</label>
                  <input type="text" name="company" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" placeholder="e.g. Google" />
                </div>
              </div>
              <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <Play size={20} />}
                Start Simulation
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="glass p-8 rounded-2xl border-indigo-500/20">
                <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Interviewer Question</h2>
                <p className="text-xl font-bold leading-relaxed">{question}</p>
              </div>

              <div className="glass p-8 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your Answer</span>
                  <div className="flex gap-2 text-[10px] font-bold text-gray-400">
                    <span className="bg-white/5 px-2 py-1 rounded">RECORDING: OFF</span>
                  </div>
                </div>
                <textarea 
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 outline-none focus:border-indigo-500 transition-all h-32" 
                  placeholder="Type your response here or use voice..."
                />
                <button className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                  <Send size={20} />
                  Submit Response
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
