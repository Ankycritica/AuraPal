import React from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Inline feature icons ── */
const featureIcons = {
  resume: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  coverLetter: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  interview: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  linkedin: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  ),
  jobFit: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  roadmap: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

const features = [
  {
    title: 'Resume Builder',
    desc: 'AI-powered resume creation with ATS scoring and premium templates.',
    icon: featureIcons.resume,
    path: '/resume-builder',
    color: '#00D4FF',
    colorMuted: 'rgba(0,212,255,0.1)',
  },
  {
    title: 'Cover Letter',
    desc: 'Generate tailored cover letters from any job posting URL.',
    icon: featureIcons.coverLetter,
    path: '/cover-letter',
    color: '#F5C842',
    colorMuted: 'rgba(245,200,66,0.1)',
  },
  {
    title: 'Interview Prep',
    desc: 'Practice with AI-generated questions and get real-time feedback.',
    icon: featureIcons.interview,
    path: '/interview-prep',
    color: '#34D399',
    colorMuted: 'rgba(52,211,153,0.1)',
  },
  {
    title: 'LinkedIn Optimizer',
    desc: 'Rewrite your profile for maximum recruiter visibility.',
    icon: featureIcons.linkedin,
    path: '/linkedin-optimizer',
    color: '#818CF8',
    colorMuted: 'rgba(129,140,248,0.1)',
  },
  {
    title: 'Job Fit Analyzer',
    desc: 'Match your resume against any job description for ATS scores.',
    icon: featureIcons.jobFit,
    path: '/job-fit',
    color: '#FB923C',
    colorMuted: 'rgba(251,146,60,0.1)',
  },
  {
    title: 'Career Roadmap',
    desc: 'Get a step-by-step skill plan from your current to target role.',
    icon: featureIcons.roadmap,
    path: '/career-roadmap',
    color: '#F472B6',
    colorMuted: 'rgba(244,114,182,0.1)',
  },
];

const recentActivity = [
  { action: 'Resume updated', detail: 'Software Engineer resume — v3', time: '2 hours ago', color: '#00D4FF' },
  { action: 'Cover letter generated', detail: 'For Google — Product Manager', time: '5 hours ago', color: '#F5C842' },
  { action: 'Interview score', detail: '87/100 — React Developer mock', time: 'Yesterday', color: '#34D399' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* ── Hero greeting ── */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          {getGreeting()}, User{' '}
          <span style={{ display: 'inline-block', animation: 'float 2s ease-in-out infinite' }}>👋</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', maxWidth: 500 }}>
          Here's your career growth snapshot. Pick a tool to get started.
        </p>
      </div>

      {/* ── Quick stats ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16, marginBottom: 40,
      }}>
        {[
          { label: 'Resumes Created', value: '3', icon: '📄' },
          { label: 'Applications Tracked', value: '12', icon: '🎯' },
          { label: 'Interview Score Avg', value: '84%', icon: '🏆' },
          { label: 'Profile Completion', value: '72%', icon: '✨' },
        ].map((stat, i) => (
          <div key={i} className="glass-card animate-fade-in" style={{
            padding: '20px 24px', animationDelay: `${i * 75}ms`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>{stat.label}</span>
              <span style={{ fontSize: 20 }}>{stat.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne', color: 'var(--color-text)' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main grid: features + activity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }} className="dashboard-grid">
        {/* Feature cards */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, fontFamily: 'Syne' }}>Your Tools</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {features.map((f, i) => (
              <div
                key={f.path}
                className="glass-card gradient-border animate-fade-in"
                style={{
                  padding: 24, cursor: 'pointer',
                  animationDelay: `${(i + 4) * 75}ms`,
                  position: 'relative', overflow: 'hidden',
                }}
                onClick={() => navigate(f.path)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${f.color}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: f.colorMuted, color: f.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, fontFamily: 'Syne' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>{f.desc}</p>
                <span style={{
                  fontSize: 13, fontWeight: 600, color: f.color,
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  Open Tool
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, fontFamily: 'Syne' }}>Recent Activity</h2>
          <div className="glass-card" style={{ padding: 20 }}>
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="animate-fade-in"
                style={{
                  display: 'flex', gap: 12, padding: '14px 0',
                  borderBottom: i < recentActivity.length - 1 ? '1px solid var(--color-border)' : 'none',
                  animationDelay: `${(i + 10) * 75}ms`,
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: item.color, marginTop: 6, flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{item.action}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{item.detail}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4 }}>{item.time}</div>
                </div>
              </div>
            ))}

            {/* Empty state hint */}
            <div style={{
              marginTop: 16, padding: '16px',
              background: 'rgba(0,212,255,0.04)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed rgba(0,212,255,0.15)',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                Complete your first resume to unlock personalized insights
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Upgrade banner ── */}
      <div className="glass-card animate-fade-in" style={{
        marginTop: 40, padding: '28px 32px',
        background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(245,200,66,0.06))',
        border: '1px solid rgba(0,212,255,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
        animationDelay: '800ms',
      }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Syne', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--color-secondary)' }}>✨</span>
            Unlock Premium
          </h3>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Get unlimited AI generations, priority support, and advanced analytics.
          </p>
        </div>
        <button
          className="btn-primary animate-pulse-glow"
          onClick={() => navigate('/pricing')}
          style={{ padding: '12px 28px', fontSize: 14 }}
        >
          Upgrade Now — $19/mo
        </button>
      </div>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
