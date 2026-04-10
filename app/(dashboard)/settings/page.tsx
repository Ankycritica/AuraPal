"use client"

import { useSession, signOut } from "next-auth/react"
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Trash2, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { data: session } = useSession()

  const handleDeleteAccount = () => {
    const confirmed = window.confirm("Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted.")
    if (confirmed) {
       toast.error("Process initiated. Please contact support to finalize deletion.")
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-fade-in pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-black">Settings</h1>
        <p className="text-gray-400 font-medium">Manage your personal information, subscription, and account security.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 px-4">Account Profile</h2>
          <div className="glass p-8 rounded-[40px] flex flex-col md:flex-row items-center gap-8">
            <img 
              src={session?.user?.image || `https://ui-avatars.com/api/?name=${session?.user?.name}&background=14b8a6&color=fff`} 
              alt="Avatar" 
              className="w-24 h-24 rounded-[32px] shadow-2xl shadow-teal-500/10"
            />
            <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-2xl font-black">{session?.user?.name}</h3>
              <p className="text-gray-500 font-medium">{session?.user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                 <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-teal-500/20">Free Plan</span>
                 <span className="px-3 py-1 bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5 flex items-center gap-1">
                   <Shield size={10} />
                   Google Verified
                 </span>
              </div>
            </div>
            <button 
              onClick={() => toast.success("Feature coming soon!")}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-sm font-bold transition-all"
            >
              Edit Profile
            </button>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 px-4">Subscription</h2>
          <div className="glass p-8 rounded-[40px] flex items-center justify-between gap-6 border-teal-500/10 bg-teal-500/5">
            <div className="space-y-1">
              <p className="font-bold flex items-center gap-2">
                <Sparkles size={16} className="text-teal-400" />
                AuraPal Pro
              </p>
              <p className="text-sm text-gray-400 font-medium">Unlock unlimited generations and priority support.</p>
            </div>
            <button 
              onClick={() => toast.success("Coming soon!")}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white text-sm font-black rounded-2xl transition-all shadow-xl shadow-teal-500/20 whitespace-nowrap"
            >
              Upgrade Now
            </button>
          </div>
        </section>

        {/* General Settings */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 px-4">General</h2>
          <div className="glass rounded-[40px] overflow-hidden divide-y divide-white/5">
            <SettingsItem icon={User} label="Personal Information" />
            <SettingsItem icon={Shield} label="Privacy & Security" />
            <SettingsItem icon={ExternalLink} label="Linked Accounts" />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-red-500/50 px-4">Danger Zone</h2>
          <div className="glass rounded-[40px] overflow-hidden">
             <button 
               onClick={handleDeleteAccount}
               className="w-full flex items-center justify-between p-6 hover:bg-red-500/5 transition-all group"
             >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                    <Trash2 size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-red-500">Delete Account</p>
                    <p className="text-xs text-gray-600 font-medium">Permanently remove all your data and content.</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-800" />
             </button>
          </div>
        </section>

        <div className="pt-6">
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-[24px] border border-white/10 transition-all flex items-center justify-center gap-3"
          >
            <LogOut size={20} />
            Sign Out of AuraPal
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingsItem({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/5 rounded-2xl text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all">
          <Icon size={20} />
        </div>
        <span className="font-bold text-gray-300 group-hover:text-white transition-colors">{label}</span>
      </div>
      <ChevronRight size={18} className="text-gray-800" />
    </button>
  )
}
