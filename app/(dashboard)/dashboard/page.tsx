import { auth } from "@/auth"
import { createServerClient } from "@/lib/supabase"
import { 
  FileText, 
  Mail, 
  MessageSquare, 
  Linkedin, 
  Target, 
  Map, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react"
import Link from "next/link"
import { formatRelativeTime } from "@/lib/utils"

async function getStats(userId: string) {
  const supabase = createServerClient()
  
  const [resumes, letters, sessions, activity] = await Promise.all([
    supabase.from("resumes").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("cover_letters").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("interview_sessions").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("activity_log").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10)
  ])

  return {
    resumes: resumes.count || 0,
    letters: letters.count || 0,
    sessions: sessions.count || 0,
    activity: activity.data || []
  }
}

export default async function DashboardPage() {
  const session = await auth()
  const stats = await getStats(session?.user?.id!)

  const morning = new Date().getHours() < 12
  const afternoon = new Date().getHours() < 18
  const greeting = morning ? "Good morning" : afternoon ? "Good afternoon" : "Good evening"

  const tools = [
    { name: "Resume Builder", desc: "Rewrite & optimize bullets", icon: FileText, href: "/resume-builder", color: "text-blue-400" },
    { name: "Resume Upload", desc: "ATS score & AI improve", icon: TrendingUp, href: "/resume-upload", color: "text-teal-400" },
    { name: "Cover Letter", desc: "Generate tailored letters", icon: Mail, href: "/cover-letter", color: "text-purple-400" },
    { name: "Interview Prep", desc: "Practice mock interviews", icon: MessageSquare, href: "/interview-prep", color: "text-green-400" },
    { name: "LinkedIn Optimizer", desc: "Rewrite profile sections", icon: Linkedin, href: "/linkedin-optimizer", color: "text-indigo-400" },
    { name: "Job Fit Analyzer", desc: "Check match with JD", icon: Target, href: "/job-fit", color: "text-orange-400" },
    { name: "Career Roadmap", desc: "AI-generated skill path", icon: Map, href: "/career-roadmap", color: "text-pink-400" },
  ]

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold">
            <Sparkles size={14} />
            <span>AI Coach is online</span>
          </div>
          <h1 className="text-4xl font-black">{greeting}, {session?.user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-gray-400 font-medium">Here's what's happening with your career growth.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Resumes" value={stats.resumes} icon={FileText} />
        <StatCard label="Cover Letters" value={stats.letters} icon={Mail} />
        <StatCard label="Interviews" value={stats.sessions} icon={MessageSquare} />
        <StatCard label="Activity" value={stats.activity.length} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Tools Section */}
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-xl font-black flex items-center gap-2">
            <Sparkles className="text-teal-400" size={20} />
            Your Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <Link 
                key={tool.href} 
                href={tool.href}
                className="glass p-6 rounded-3xl hover:border-teal-500/30 transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div className={stats.resumes === 0 && tool.name === "Resume Builder" ? "relative" : ""}>
                      <tool.icon size={28} className={tool.color} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-teal-400 transition-colors">{tool.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">{tool.desc}</p>
                    </div>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl group-hover:bg-teal-500 group-hover:text-white transition-all">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-black flex items-center gap-2">
            <Clock className="text-gray-400" size={20} />
            Recent Activity
          </h2>
          <div className="glass rounded-3xl overflow-hidden divide-y divide-white/5">
            {stats.activity.length > 0 ? (
              stats.activity.map((item: any) => (
                <div key={item.id} className="p-5 flex items-start gap-4 hover:bg-white/5 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0 shadow-[0_0_10px_#14b8a6]" />
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{item.action}</p>
                    <p className="text-xs text-gray-500 font-medium">{item.details}</p>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{formatRelativeTime(item.created_at)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-gray-700">
                  <Target size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-400">No activity yet</p>
                  <p className="text-xs text-gray-600">Start using the tools above to track your progress.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon }: any) {
  return (
    <div className="glass p-6 rounded-3xl space-y-1 border-l-4 border-l-teal-500 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between text-gray-500">
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        <Icon size={16} />
      </div>
      <div className="text-3xl font-black">{value}</div>
    </div>
  )
}
