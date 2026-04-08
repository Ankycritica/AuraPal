import React, { useState } from 'react';
import { LucideWand2, Loader2, Copy, RefreshCw, CheckCheck } from 'lucide-react';
import { useToast } from './ui/use-toast';

export function AIGeneratorTool({ title, description, endpoint, fields }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const { push: toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/ai/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate content');
      
      setResult(data.result);
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="bg-[#111113] p-6 rounded-xl border border-white/10 shadow-2xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">{title}</h2>
        <p className="text-gray-400 mb-6">{description}</p>
        
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-300 mb-1">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  className="w-full bg-[#1A1A1D] border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 min-h-[150px] transition-all"
                  placeholder={field.placeholder}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  className="w-full bg-[#1A1A1D] border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder={field.placeholder}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                />
              )}
            </div>
          ))}
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LucideWand2 className="w-5 h-5" />}
            {loading ? 'Generating magically...' : 'Generate Now'}
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="bg-[#111113] p-6 rounded-xl border border-white/10 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <LucideWand2 className="w-5 h-5 text-indigo-400" />
            Result
          </h3>
          {result && (
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-md transition-colors text-gray-300"
                title="Copy output"
              >
                {copied ? <CheckCheck className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button 
                onClick={handleGenerate}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-md transition-colors text-gray-300"
                title="Regenerate"
              >
                 <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex-1 bg-[#0A0A0B] rounded-lg border border-white/5 p-4 overflow-auto min-h-[300px]">
          {result ? (
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">
              {result}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 italic">
              Your AI-generated content will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
