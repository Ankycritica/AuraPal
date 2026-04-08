import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Briefcase, FileText, Lightbulb, Rocket, Send, Copy, CheckCheck } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { push: toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const quickActions = [
    { title: 'Fix My Resume', path: '/resume-fixer', icon: <Briefcase className="w-5 h-5 text-indigo-400" /> },
    { title: 'Generate Side Hustle', path: '/side-hustle-ideas', icon: <Lightbulb className="w-5 h-5 text-amber-400" /> },
    { title: 'Roast My LinkedIn', path: '/linkedin-roast', icon: <FileText className="w-5 h-5 text-blue-400" /> },
    { title: 'Build Business Plan', path: '/business-plan-generator', icon: <Rocket className="w-5 h-5 text-red-400" /> },
    { title: 'Write SEO Article', path: '/seo-article-generator', icon: <Sparkles className="w-5 h-5 text-purple-400" /> },
  ];

  const handleChat = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/unified-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to communicate with AuraPal');
      
      setResult(data.result);
      setPrompt('');
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center mb-10 w-full mt-10">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20 transform rotate-3 hover:rotate-6 transition-all">
           <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white block to-white/60">
          How can I accelerate your growth today?
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          I am AuraPal, your personal AI engine for career advancement and income generation. Ask me anything or choose a quick action.
        </p>
      </div>

      {/* Main Chat Input */}
      <form onSubmit={handleChat} className="w-full relative group mb-12">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-[#1A1A1D] border border-white/10 rounded-2xl p-2 shadow-2xl">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            placeholder="E.g. Write a cold email to a recruiter at Google..."
            className="flex-1 bg-transparent border-none text-white text-lg px-4 py-3 focus:outline-none focus:ring-0 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-white text-black p-3 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>

      {/* Chat Result Box */}
      {result && (
        <div className="w-full bg-[#111113] border border-white/10 rounded-2xl p-6 mb-12 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="absolute top-4 right-4">
             <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
               {copied ? <CheckCheck className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
             </button>
           </div>
           <div className="prose prose-invert prose-p:leading-relaxed max-w-none whitespace-pre-wrap mt-2 pr-8">
             {result}
           </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="w-full">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
           <Sparkles className="w-4 h-4" /> Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-4 bg-[#111113] border border-white/5 hover:border-white/20 p-4 rounded-xl transition-all group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 text-left"
            >
              <div className="bg-[#1A1A1D] p-3 rounded-lg group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <div>
                <h4 className="text-white font-medium">{action.title}</h4>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto text-gray-600 group-hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
