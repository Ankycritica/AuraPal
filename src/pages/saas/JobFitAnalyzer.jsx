import React, { useState } from 'react';
import { useToast } from '../../components/ui/use-toast';

export default function JobFitAnalyzer() {
  const { push: toast } = useToast();
  const [jobDesc, setJobDesc] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleAnalyze = async () => {
    if (!jobDesc.trim() || !resumeText.trim()) return toast({ title: 'Please fill in both fields' });
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'job-fit', prompt: `Job Description:\n${jobDesc}\n\nResume:\n${resumeText}` }),
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
    <div className="animate-fade-in" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne', marginBottom: 8 }}>Job Fit Analyzer</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32 }}>Paste a job description and your resume to get an ATS match score and gap analysis.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }} className="jobfit-grid">
        <div className="glass-card" style={{ padding: 24 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Job Description</label>
          <textarea className="input-field" value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here..." style={{ minHeight: 220, resize: 'vertical' }} />
        </div>
        <div className="glass-card" style={{ padding: 24 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Your Resume</label>
          <textarea className="input-field" value={resumeText} onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..." style={{ minHeight: 220, resize: 'vertical' }} />
        </div>
      </div>

      <button className="btn-primary" onClick={handleAnalyze} disabled={loading}
        style={{ width: '100%', padding: '14px 0', fontSize: 15, marginBottom: 24 }}>
        {loading ? 'Analyzing Match...' : 'Analyze Fit →'}
      </button>

      {result && !loading && (
        <div className="glass-card animate-fade-in" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Syne', marginBottom: 16 }}>Analysis Results</h2>
          <div style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
            padding: 24, border: '1px solid var(--color-border)',
            whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8,
          }}>{result}</div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .jobfit-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
