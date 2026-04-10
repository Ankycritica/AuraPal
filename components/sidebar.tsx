"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  Mail, 
  MessageSquare, 
  Linkedin, 
  Target, 
  Map, 
  Settings,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"
import toast from "react-hot-toast"

const navLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resume Builder", href: "/resume-builder", icon: FileText },
  { name: "Resume Upload", href: "/resume-upload", icon: Upload },
  { name: "Cover Letter", href: "/cover-letter", icon: Mail },
  { name: "Interview Prep", href: "/interview-prep", icon: MessageSquare },
  { name: "LinkedIn Optimizer", href: "/linkedin-optimizer", icon: Linkedin },
  { name: "Job Fit Analyzer", href: "/job-fit", icon: Target },
  { name: "Career Roadmap", href: "/career-roadmap", icon: Map },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1e293b] rounded-lg border border-gray-800 text-teal-400"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ 
          width: isCollapsed ? "80px" : "280px",
          x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0)
        }}
        className={cn(
          "fixed top-0 left-0 h-screen bg-[#0d1224] border-r border-gray-800 z-50 flex flex-col transition-all duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/dashboard" className="text-2xl font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              AuraPal
            </Link>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1.5 hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                )}
              >
                <link.icon size={22} className={cn(isActive ? "text-white" : "group-hover:text-teal-400")} />
                {!isCollapsed && (
                  <span className="font-medium text-sm whitespace-nowrap">{link.name}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
                    {link.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-4">
          {!isCollapsed && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20">
              <div className="flex items-center gap-2 text-teal-400 mb-2">
                <Sparkles size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Upgrade to Pro</span>
              </div>
              <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">Unlimited AI generations, priority support & advanced analytics.</p>
              <button 
                onClick={() => toast.success("Coming soon!")}
                className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-teal-500/20"
              >
                Upgrade Now
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-gray-800 space-y-3">
            <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "px-2")}>
              <img 
                src={user?.image || `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=14b8a6&color=fff`} 
                alt="Avatar" 
                className="w-10 h-10 rounded-xl"
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-white">{user?.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => signOut()}
              className={cn(
                "w-full flex items-center gap-3 text-gray-500 hover:text-red-400 transition-colors duration-200",
                isCollapsed ? "justify-center" : "px-3 py-2"
              )}
            >
              <LogOut size={20} />
              {!isCollapsed && <span className="font-bold text-xs uppercase tracking-widest">Sign Out</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Custom styles for the scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
        @media (min-width: 1024px) {
          .main-content {
            margin-left: ${isCollapsed ? "80px" : "280px"};
          }
        }
      `}</style>
    </>
  )
}
