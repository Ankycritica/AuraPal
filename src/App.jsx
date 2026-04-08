import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SaaSLayout } from './components/SaaSLayout';
import { ToastProvider } from './components/ui/use-toast';

// New SaaS Pages
import Dashboard from './pages/saas/Dashboard';
import { SEOGenerator } from './pages/saas/SEOGenerator';
import { ResumeFixer } from './pages/saas/ResumeFixer';
import { LinkedInRoast } from './pages/saas/LinkedInRoast';
import { BusinessPlan } from './pages/saas/BusinessPlan';
import { SideHustles } from './pages/saas/SideHustles';
import { BulkArticle } from './pages/saas/BulkArticle';
import PricingSaaS from './pages/saas/PricingSaaS';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<SaaSLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/seo-article-generator" element={<SEOGenerator />} />
            <Route path="/resume-fixer" element={<ResumeFixer />} />
            <Route path="/linkedin-roast" element={<LinkedInRoast />} />
            <Route path="/business-plan-generator" element={<BusinessPlan />} />
            <Route path="/side-hustle-ideas" element={<SideHustles />} />
            <Route path="/bulk-article-generator" element={<BulkArticle />} />
            <Route path="/pricing" element={<PricingSaaS />} />
            {/* Catch-all for settings/profile placeholder */}
            <Route path="/settings" element={
              <div className="text-center mt-20">
                <h2 className="text-2xl font-bold mb-2">Settings</h2>
                <p className="text-gray-400">Manage your profile and API keys here.</p>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
