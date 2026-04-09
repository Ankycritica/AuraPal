"use client";

import React, { useState } from 'react';
import { FileText, Upload, Sparkles, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResumeBuilderPage() {
  const [parsing, setParsing] = useState(false);
  
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Resume Builder</h1>
            <p className="text-gray-400 mt-1">AI-powered resume creation and ATS optimization</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">
            <Download size={20} />
            <span>Export PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Side */}
          <div className="space-y-6">
            <div className="glass p-8 rounded-2xl border-dashed border-2 border-white/10 hover:border-indigo-500/50 transition-all text-center">
              <div className="w-16 h-16 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Upload existing resume</h3>
              <p className="text-sm text-gray-400 mb-6">We'll parse your details using Affinda AI (50/mo limit)</p>
              <button className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-lg text-sm font-semibold transition-colors">
                Select File
              </button>
            </div>

            <div className="glass p-8 rounded-2xl space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="text-indigo-400 w-5 h-5" />
                Personal Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                  <input type="email" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Professional Summary</label>
                <textarea className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all h-32" placeholder="Tell us about your professional journey..." />
              </div>
            </div>
          </div>

          {/* Preview Side */}
          <div className="glass rounded-2xl p-8 bg-white min-h-[800px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-[10px] bg-indigo-600/10 text-indigo-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest">Preview Mode</span>
            </div>
            
            <div id="resume-preview" className="text-gray-900 space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight">YOUR NAME</h1>
                <div className="text-sm text-gray-500 flex justify-center gap-4">
                  <span>email@example.com</span>
                  <span>•</span>
                  <span>+1 (555) 000-0000</span>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-gray-900 pb-1">Professional Summary</h2>
                <p className="text-sm leading-relaxed text-gray-700 italic">
                  Complete these sections to see your AI-optimized resume take shape here...
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-gray-900 pb-1">Experience</h2>
                <div className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-sm">
                      <span>Company Name</span>
                      <span>Jan 2020 — Present</span>
                    </div>
                    <p className="text-sm italic font-medium">Job Title</p>
                    <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                      <li>Accomplished X, as measured by Y, by doing Z.</li>
                      <li>Spearheaded international expansion...</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
