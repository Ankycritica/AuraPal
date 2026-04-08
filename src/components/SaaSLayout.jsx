import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Linkedin, 
  Lightbulb, 
  Settings, 
  CreditCard,
  Rocket,
  Layers
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/seo-article-generator', label: 'SEO Article Writer', icon: <FileText className="w-5 h-5" /> },
  { path: '/bulk-article-generator', label: 'Bulk Articles', icon: <Layers className="w-5 h-5" /> },
  { path: '/resume-fixer', label: 'Resume Fixer', icon: <Briefcase className="w-5 h-5" /> },
  { path: '/linkedin-roast', label: 'LinkedIn Roast', icon: <Linkedin className="w-5 h-5" /> },
  { path: '/business-plan-generator', label: 'Business Plan', icon: <Rocket className="w-5 h-5" /> },
  { path: '/side-hustle-ideas', label: 'Side Hustles', icon: <Lightbulb className="w-5 h-5" /> },
];

const bottomItems = [
  { path: '/pricing', label: 'Billing & Plans', icon: <CreditCard className="w-5 h-5" /> },
  { path: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export function SaaSLayout() {
  return (
    <div className="flex h-screen bg-[#09090B] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#111113] border-r border-white/10 flex flex-col transition-all">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">AuraPal</h1>
          </div>
          <p className="text-xs text-indigo-400 mt-1 font-medium tracking-wider uppercase">Career + Growth</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
          <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider pl-3">Tools</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          {bottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
          <div className="mt-4 p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
             <p className="text-xs text-gray-300 font-medium mb-2">5/5 Credits Remaining</p>
             <div className="w-full bg-gray-800 rounded-full h-1.5 mb-3">
               <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
             </div>
             <NavLink to="/pricing" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer">Upgrade to Pro →</NavLink>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#09090B]">
        <div className="p-8 pb-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
