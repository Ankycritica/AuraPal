import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  Mail, 
  Mic2, 
  Linkedin, 
  Target, 
  Map, 
  Settings,
  Bell,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, href, active }: any) => (
  <Link 
    href={href}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? "bg-indigo-600/10 text-indigo-400 font-semibold" 
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);

export default function DashboardPage() {
  const tools = [
    { 
      title: "Resume Builder", 
      desc: "ATS-optimized resume rewrite and scoring", 
      icon: <FileText className="text-blue-400" />, 
      href: "/resume-builder",
      tag: "Popular"
    },
    { 
      title: "Cover Letter", 
      desc: "Tailored letter for any job role", 
      icon: <Mail className="text-purple-400" />, 
      href: "/cover-letter" 
    },
    { 
      title: "Interview Prep", 
      desc: "Simulate interviews with real-time feedback", 
      icon: <Mic2 className="text-green-400" />, 
      href: "/interview-prep" 
    },
    { 
      title: "LinkedIn Optimizer", 
      desc: "Rewrite sections for recruiter visibility", 
      icon: <Linkedin className="text-indigo-400" />, 
      href: "/linkedin-optimizer" 
    },
    { 
      title: "Job Fit Analyzer", 
      desc: "Check your resume match with a JD", 
      icon: <Target className="text-orange-400" />, 
      href: "/job-fit" 
    },
    { 
      title: "Career Roadmap", 
      desc: "AI-generated steps to reach your target role", 
      icon: <Map className="text-pink-400" />, 
      href: "/career-roadmap" 
    },
  ];

  return (
    <div className="flex h-screen bg-[#0A0F1E] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0D1224] flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-xl font-bold tracking-tight">AuraPal</span>
          </div>

          <nav className="space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-4 mb-2">Main Menu</p>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" active />
            <SidebarItem icon={FileText} label="Resume Builder" href="/resume-builder" />
            <SidebarItem icon={Mail} label="Cover Letter" href="/cover-letter" />
            <SidebarItem icon={Mic2} label="Interview Prep" href="/interview-prep" />
            <SidebarItem icon={Linkedin} label="LinkedIn" href="/linkedin-optimizer" />
            <SidebarItem icon={Target} label="Job Fit" href="/job-fit" />
            <SidebarItem icon={Map} label="Roadmap" href="/career-roadmap" />
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-white/5 space-y-1">
          <SidebarItem icon={Settings} label="Settings" href="/settings" />
          
          <div className="mt-4 p-4 glass rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-yellow-400 w-4 h-4" />
              <span className="text-xs font-bold text-yellow-400">Upgrade to Pro</span>
            </div>
            <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">Unlock unlimited AI generations and premium templates.</p>
            <Link href="/pricing" className="block text-center text-xs bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-bold transition-colors">
              Upgrade Now
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0F1E]/50 backdrop-blur-md">
          <div className="flex items-center gap-4 bg-white/5 border border-white/5 px-4 py-2 rounded-xl w-96">
            <Search size={18} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search features..." 
              className="bg-transparent border-none outline-none text-sm w-full text-gray-300"
            />
            <span className="text-[10px] font-bold text-gray-600 bg-white/5 px-2 py-0.5 rounded-md">CMD K</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold shadow-lg">
              UD
            </div>
          </div>
        </header>

        {/* Dashboard View */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, User 👋</h1>
                <p className="text-gray-400 mt-1">Ready to accelerate your career today?</p>
              </div>
              <div className="flex gap-4">
                <div className="glass p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 flex items-center justify-center">
                    <span className="text-sm font-bold">72%</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Profile Score</p>
                    <p className="text-sm font-bold">Excellent Progress</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, idx) => (
                <div 
                  key={idx} 
                  className="glass p-6 rounded-2xl group hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all">
                    {React.cloneElement(tool.icon as React.ReactElement, { size: 80 })}
                  </div>
                  
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                    {tool.icon}
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    {tool.title}
                    {tool.tag && (
                      <span className="text-[10px] bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                        {tool.tag}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    {tool.desc}
                  </p>
                  
                  <Link 
                    href={tool.href}
                    className="flex items-center gap-2 text-sm font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors"
                  >
                    Open Tool <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass rounded-2xl p-8 bg-indigo-600/5 border-indigo-500/10">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="text-indigo-400 w-5 h-5" />
                  Premium Insights
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-sm font-medium">ATS Trend Alert</p>
                    <p className="text-xs text-gray-400 mt-1">Found 5 new keywords relevant to "Product Management" roles this week.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-sm font-medium">LinkedIn Visibility</p>
                    <p className="text-xs text-gray-400 mt-1">Recruiters from Google and Amazon viewed your profile updates.</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                <div className="space-y-6">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">Resume Updated</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
