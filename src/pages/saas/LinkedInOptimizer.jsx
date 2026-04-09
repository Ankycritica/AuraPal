import React, { useState } from 'react';
import { useToast } from '../../components/ui/use-toast';

export default function LinkedInOptimizer() {
  const { push: toast } = useToast();
  const [profileText, setProfileText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!profileText.trim()) return toast({ title: 'Please paste your LinkedIn content' });
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'linkedin-optimizer', prompt: profileText }),
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
      <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne', marginBottom: 8 }}>LinkedIn Optimizer</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32 }}>Paste your LinkedIn sections and get AI-optimized rewrites for maximum recruiter visibility.</p>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 24 }} className="linkedin-grid">
        <div className="glass-card" style={{ padding: 32 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Your LinkedIn Content</label>
          <textarea
            className="input-field"
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
            placeholder="Paste your headline, about section, or experience descriptions..."
            style={{ minHeight: 250, resize: 'vertical' }}
          />
          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={loading || !profileText.trim()}
            style={{ marginTop: 16, width: '100%', padding: '14px 0', fontSize: 15 }}
          >
            {loading ? 'Optimizing...' : 'Optimize My LinkedIn →'}
          </button>
        </div>

        {result && !loading && (
          <div className="glass-card animate-slide-in-right" style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Syne' }}>Optimized Version</h2>
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

      <style>{`
        @media (max-width: 768px) {
          .linkedin-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
