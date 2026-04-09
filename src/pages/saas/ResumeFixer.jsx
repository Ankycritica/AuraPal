import React, { useState } from 'react';
import { useToast } from '../../components/ui/use-toast';

export default function ResumeFixer() {
  const { push: toast } = useToast();
  const [step, setStep] = useState(0);
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!resumeText.trim()) return toast({ title: 'Please paste your resume content' });
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'resume-fixer', prompt: resumeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setResult(data.result);
      setStep(2);
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne', marginBottom: 8 }}>Resume Builder</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32 }}>Paste your resume text and let AI transform it into a recruiter-magnet.</p>

      {/* Step indicators */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {['Paste Resume', 'AI Rewrite', 'Export'].map((s, i) => (
          <div key={i} style={{
            flex: 1, padding: '10px 0', textAlign: 'center',
            fontSize: 13, fontWeight: step >= i ? 700 : 400,
            color: step >= i ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
            borderBottom: `2px solid ${step >= i ? 'var(--color-primary)' : 'var(--color-border)'}`,
            transition: 'all var(--duration-slow) var(--ease)',
          }}>
            {s}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="glass-card" style={{ padding: 32 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Your Current Resume</label>
          <textarea
            className="input-field"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here... Include your experience, skills, education..."
            style={{ minHeight: 300, resize: 'vertical', fontFamily: 'DM Sans' }}
          />
          <button
            className="btn-primary"
            onClick={() => { setStep(1); handleGenerate(); }}
            disabled={loading || !resumeText.trim()}
            style={{ marginTop: 16, width: '100%', padding: '14px 0', fontSize: 15 }}
          >
            {loading ? 'Analyzing with AI...' : 'Fix My Resume →'}
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
          <div className="skeleton" style={{ height: 20, width: '80%', margin: '0 auto 12px' }} />
          <div className="skeleton" style={{ height: 20, width: '60%', margin: '0 auto 12px' }} />
          <div className="skeleton" style={{ height: 20, width: '70%', margin: '0 auto 12px' }} />
          <div className="skeleton" style={{ height: 20, width: '50%', margin: '0 auto 24px' }} />
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>AI is rewriting your resume...</p>
        </div>
      )}

      {step === 2 && result && (
        <div className="glass-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Syne' }}>AI-Enhanced Resume</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-ghost" onClick={() => {
                navigator.clipboard.writeText(result);
                toast({ title: 'Copied to clipboard' });
              }}>Copy</button>
              <button className="btn-ghost" onClick={() => { setStep(0); setResult(''); }}>Start Over</button>
            </div>
          </div>
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            padding: 24, border: '1px solid var(--color-border)',
            whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8,
            color: 'var(--color-text)',
          }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
