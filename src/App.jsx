import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/use-toast';
import AppShell from './components/AppShell';

// Pages
import Dashboard from './pages/saas/Dashboard';
import ResumeFixer from './pages/saas/ResumeFixer';
import CoverLetter from './pages/saas/CoverLetter';
import InterviewPrep from './pages/saas/InterviewPrep';
import LinkedInOptimizer from './pages/saas/LinkedInOptimizer';
import JobFitAnalyzer from './pages/saas/JobFitAnalyzer';
import CareerRoadmap from './pages/saas/CareerRoadmap';
import PricingSaaS from './pages/saas/PricingSaaS';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume-builder" element={<ResumeFixer />} />
            <Route path="/cover-letter" element={<CoverLetter />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />
            <Route path="/linkedin-optimizer" element={<LinkedInOptimizer />} />
            <Route path="/job-fit" element={<JobFitAnalyzer />} />
            <Route path="/career-roadmap" element={<CareerRoadmap />} />
            <Route path="/pricing" element={<PricingSaaS />} />
            <Route path="/settings" element={
              <div style={{ textAlign: 'center', paddingTop: 80 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Syne', marginBottom: 8 }}>Settings</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Profile, billing, and preferences coming soon.</p>
              </div>
            } />
            <Route path="*" element={
              <div style={{ textAlign: 'center', paddingTop: 80 }}>
                <h2 style={{ fontSize: 48, fontWeight: 800, fontFamily: 'Syne', color: 'var(--color-primary)', marginBottom: 8 }}>404</h2>
                <p style={{ fontSize: 18, color: 'var(--color-text-secondary)' }}>This page doesn't exist yet.</p>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
