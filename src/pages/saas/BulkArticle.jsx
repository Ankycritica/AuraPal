import React, { useState } from 'react';
import { UploadCloud, FileText, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';

export function BulkArticle() {
  const { push: toast } = useToast();
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    const keywordList = keywords.split('\n').map(k => k.trim()).filter(k => k);
    if (keywordList.length === 0) return toast({ title: 'Please enter at least one keyword' });
    
    setLoading(true);
    const newResults = [];
    
    // Process them sequentially to avoid rate limits on the dummy model/OpenAI
    for (const kw of keywordList) {
      try {
        const res = await fetch('/api/ai/seo-article', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword: kw })
        });
        const data = await res.json();
        if (res.ok) {
          newResults.push({ keyword: kw, content: data.result, status: 'success' });
        } else {
          newResults.push({ keyword: kw, content: data.error, status: 'error' });
        }
      } catch (e) {
        newResults.push({ keyword: kw, content: 'Failed to generate', status: 'error' });
      }
    }
    
    setResults(newResults);
    setLoading(false);
    toast({ title: 'Bulk generation complete' });
  };

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Keyword,Content\n" + 
      results.map(e => `"${e.keyword}","${e.content.replace(/"/g, '""')}"`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bulk_articles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Bulk Article Generator</h1>
        <p className="text-gray-400 text-lg">Generate hundreds of SEO-optimized articles from a list of keywords.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input */}
        <div className="bg-[#111113] p-6 rounded-xl border border-white/10 shadow-xl">
           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
             <UploadCloud className="w-5 h-5 text-indigo-400" /> Upload Keywords
           </h2>
           <p className="text-sm text-gray-400 mb-4">Paste your keywords below, one per line.</p>
           
           <textarea
             value={keywords}
             onChange={(e) => setKeywords(e.target.value)}
             className="w-full bg-[#1A1A1D] border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 min-h-[300px]"
             placeholder="best running shoes&#10;how to train for a marathon&#10;marathon diet plan..."
           />
           
           <button
            onClick={handleGenerate}
            disabled={loading || !keywords}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
           >
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
             {loading ? 'Processing Keywords...' : 'Generate Articles'}
           </button>
        </div>
        
        {/* Output */}
        <div className="bg-[#111113] p-6 rounded-xl border border-white/10 shadow-xl flex flex-col">
           <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
             <h2 className="text-xl font-bold flex items-center gap-2">
               Results <span className="bg-white/10 text-xs px-2 py-1 rounded-md">{results.length}</span>
             </h2>
             {results.length > 0 && (
               <button onClick={handleDownload} className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
                 <Download className="w-4 h-4" /> Download CSV
               </button>
             )}
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-3 max-h-[400px] pr-2">
             {results.length === 0 ? (
               <div className="h-full flex items-center justify-center text-gray-500 italic">
                 Generated articles will appear here.
               </div>
             ) : (
               results.map((res, i) => (
                 <div key={i} className="p-3 bg-[#1A1A1D] rounded-lg border border-white/5 flex items-start gap-3">
                   {res.status === 'success' ? (
                     <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                   ) : (
                     <div className="w-5 h-5 rounded-full bg-red-400 shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold">X</div>
                   )}
                   <div>
                     <h4 className="font-medium text-gray-200">{res.keyword}</h4>
                     <p className="text-xs text-gray-500 truncate max-w-sm mt-1">{res.content}</p>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
