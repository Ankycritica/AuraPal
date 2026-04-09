import React, { useState } from 'react';
import { useToast } from '../../components/ui/use-toast';

export default function InterviewPrep() {
  const { push: toast } = useToast();
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState('');

  const handleGenerate = async () => {
    if (!role.trim()) return toast({ title: 'Please enter a role' });
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'interview-prep', prompt: `Role: ${role}\nCompany: ${company || 'Any'}` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setQuestions(data.result);
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne', marginBottom: 8 }}>Interview Simulator</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32 }}>Practice with real interview questions tailored to your target role and company.</p>

      <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Target Role</label>
            <input className="input-field" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Company (optional)</label>
            <input className="input-field" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Google, Meta, Stripe" />
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={loading || !role.trim()}
          style={{ width: '100%', padding: '14px 0', fontSize: 15 }}
        >
          {loading ? 'Generating Questions...' : 'Start Interview Prep →'}
        </button>
      </div>

      {loading && (
        <div className="glass-card" style={{ padding: 32 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 16, width: `${80 - i * 8}%`, marginBottom: 12 }} />
          ))}
        </div>
      )}

      {questions && !loading && (
        <div className="glass-card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Syne', marginBottom: 16 }}>Interview Questions</h2>
          <div style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
            padding: 24, border: '1px solid var(--color-border)',
            whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8,
          }}>
            {questions}
          </div>
        </div>
      )}
    </div>
  );
}
