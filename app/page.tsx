import { auth } from "@/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react"

export default async function LandingPage() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] overflow-hidden">
      {/* Top Navbar */}
      <header className="absolute top-0 w-full z-50 p-6 flex justify-between items-center max-w-7xl mx-auto left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="AuraPal Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            AuraPal
          </span>
        </div>
        <Link href="/login" className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/5 text-white font-bold rounded-xl transition-all">
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-32 px-4 max-w-7xl mx-auto">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-teal-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-bold animate-fade-in shadow-lg shadow-teal-500/5">
            <Sparkles size={16} />
            <span>AI-Powered Career Engine</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-white">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Fix your resume</span> in 30 seconds.
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Build ATS-killing resumes, generate targeted cover letters, and master interviews with your AI-powered career coach.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 group"
            >
              Get Started Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#features" 
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all"
            >
              Explore Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 px-4 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-3xl space-y-4 hover:border-teal-500/30 transition-all group">
            <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">Instant Optimization</h3>
            <p className="text-gray-400 leading-relaxed">AI-driven improvements for your resume and LinkedIn profile in seconds, not hours.</p>
          </div>

          <div className="glass p-8 rounded-3xl space-y-4 hover:border-teal-500/30 transition-all group">
            <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold">ATS Scoring</h3>
            <p className="text-gray-400 leading-relaxed">Real-time feedback on how your resume matches job descriptions for top Applicant Tracking Systems.</p>
          </div>

          <div className="glass p-8 rounded-3xl space-y-4 hover:border-teal-500/30 transition-all group">
            <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold">Smart Roadmaps</h3>
            <p className="text-gray-400 leading-relaxed">Personalized career paths generated based on global hiring trends and your target roles.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2026 AuraPal. Built with AI for the future of work.</p>
      </footer>
    </div>
  )
}
