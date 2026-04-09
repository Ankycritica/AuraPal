import React, { useState } from 'react';
import { useToast } from '../../components/ui/use-toast';

export default function CareerRoadmap() {
  const { push: toast } = useToast();
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!currentRole.trim() || !targetRole.trim()) return toast({ title: 'Please fill in both roles' });
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'career-roadmap', prompt: `Current Role: ${currentRole}\nTarget Role: ${targetRole}` }),
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
      <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne', marginBottom: 8 }}>Career Roadmap</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32 }}>Enter where you are and where you want to be — AI builds your step-by-step skill plan.</p>

      <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Current Role</label>
            <input className="input-field" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="e.g. Junior Developer" />
          </div>
          <div style={{
            fontSize: 20, color: 'var(--color-primary)', fontWeight: 800,
            padding: '0 8px 10px', fontFamily: 'Syne',
          }}>→</div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Target Role</label>
            <input className="input-field" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Staff Engineer at FAANG" />
          </div>
        </div>
        <button className="btn-primary" onClick={handleGenerate} disabled={loading}
          style={{ width: '100%', padding: '14px 0', fontSize: 15, marginTop: 20 }}>
          {loading ? 'Building Roadmap...' : 'Generate My Roadmap →'}
        </button>
      </div>

      {loading && (
        <div className="glass-card" style={{ padding: 32 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div className="skeleton" style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 14, width: `${70 + i * 3}%`, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: `${50 + i * 5}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="glass-card animate-fade-in" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Syne', marginBottom: 16 }}>Your Career Roadmap</h2>
          <div style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
            padding: 24, border: '1px solid var(--color-border)',
            whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8,
          }}>{result}</div>
        </div>
      )}
    </div>
  );
}
