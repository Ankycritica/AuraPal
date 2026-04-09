import React, { useState } from 'react';
import { useToast } from '../../components/ui/use-toast';

export default function CoverLetter() {
  const { push: toast } = useToast();
  const [jobUrl, setJobUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!jobUrl.trim()) return toast({ title: 'Please enter a job posting URL or description' });
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'cover-letter', prompt: jobUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setResult(data.result);
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne', marginBottom: 8 }}>Cover Letter Generator</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32 }}>Paste a job URL or description — AI writes a tailored cover letter in seconds.</p>

      <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Job Posting URL or Description</label>
        <textarea
          className="input-field"
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
          placeholder="https://careers.google.com/... or paste the full job description here"
          style={{ minHeight: 120, resize: 'vertical' }}
        />
        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={loading || !jobUrl.trim()}
          style={{ marginTop: 16, width: '100%', padding: '14px 0', fontSize: 15 }}
        >
          {loading ? 'Generating...' : 'Generate Cover Letter →'}
        </button>
      </div>

      {loading && (
        <div className="glass-card" style={{ padding: 32 }}>
          <div className="skeleton" style={{ height: 18, width: '90%', marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 18, width: '75%', marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 18, width: '85%', marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 18, width: '60%' }} />
        </div>
      )}

      {result && !loading && (
        <div className="glass-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Syne' }}>Your Cover Letter</h2>
            <button className="btn-ghost" onClick={() => {
              navigator.clipboard.writeText(result);
              toast({ title: 'Copied!' });
            }}>Copy</button>
          </div>
          <div style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
            padding: 24, border: '1px solid var(--color-border)',
            whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8,
          }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
