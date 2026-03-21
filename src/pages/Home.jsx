import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Lock, Globe, Zap, MessageSquare, Video, Mic, RefreshCw, Hash, Users, ArrowRight, Play, Star, Heart } from 'lucide-react'
import { Button } from '../components/ui/button'

export function Home() {
  const navigate = useNavigate()

  // Framer Motion variants for staggered entrances
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  }

  // Auto-scroll to How It Works
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  // ─── Luxe Light / Expensive Background Elements ────────────────────────────
  const [stars] = React.useState(() => [...Array(120)].map(() => ({
    top: Math.random() * 100 + '%',
    left: Math.random() * 100 + '%',
    width: Math.random() * 2 + 'px',
    height: Math.random() * 2 + 'px',
    opacity: Math.random() * 0.3,
    duration: 2 + Math.random() * 4,
    delay: Math.random() * 5
  })))

  const [meshLines] = React.useState(() => [...Array(20)].map(() => ({
    x1: `${Math.random() * 100}%`,
    y1: `${Math.random() * 100}%`,
    x2: `${Math.random() * 100}%`,
    y2: `${Math.random() * 100}%`,
  })))

  return (
    <div className="bg-[#09090B] text-white selection:bg-ap-indigo/30 font-sans overflow-x-hidden relative">
      
      {/* 🚀 Billionaire-Grade Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
        {/* Deep Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-ap-indigo/10 via-transparent to-ap-emerald/5 opacity-50" />

        {/* Large Cinematic Mesh Orbs */}
        <motion.div 
          animate={{ 
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[15%] -left-[10%] w-[50%] aspect-square bg-[#4F46E5]/20 blur-[140px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -90, 60, 0],
            y: [0, 80, -40, 0],
            scale: [1, 1.3, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] -right-[15%] w-[45%] aspect-square bg-[#10B981]/15 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, 50, -80, 0],
            y: [0, -40, 60, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 3 }}
          className="absolute bottom-[5%] left-[20%] w-[40%] aspect-square bg-indigo-500/10 blur-[130px] rounded-full"
        />

        {/* Dynamic Dark Grid */}
        <div 
          className="absolute inset-0 opacity-[0.07]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, #ffffff 1.2px, transparent 0)`,
            backgroundSize: '48px 48px' 
          }}
        />
        
        {/* Animated Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

        {/* 🌌 High-Density Starfield (Fills the 'Empty' Void) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {stars.map((star, i) => (
            <motion.div
              key={i}
              initial={{ opacity: star.opacity }}
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ 
                duration: star.duration, 
                repeat: Infinity, 
                delay: star.delay 
              }}
              className="absolute bg-white rounded-full"
              style={{ 
                width: star.width, 
                height: star.height,
                top: star.top, 
                left: star.left 
              }}
            />
          ))}
        </div>

        {/* ⛓ Connectivity Mesh Layer */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none z-0">
          <defs>
            <linearGradient id="meshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          {meshLines.map((line, i) => (
            <motion.line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="url(#meshGrad)"
              strokeWidth="0.5"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 10, delay: i * 2, repeat: Infinity }}
            />
          ))}
        </svg>


        {/* Floating Social Elements (Themed for Dark) */}
        <div className="absolute inset-0 z-0">
          {[
            { Icon: MessageSquare, top: '15%', left: '8%', size: 44, delay: 0, opacity: 0.15 },
            { Icon: Video, top: '22%', right: '12%', size: 36, delay: 1.5, opacity: 0.12 },
            { Icon: Globe, bottom: '25%', left: '12%', size: 52, delay: 2.5, opacity: 0.1 },
            { Icon: Users, top: '48%', right: '8%', size: 40, delay: 2, opacity: 0.12 },
            { Icon: Heart, bottom: '38%', right: '18%', size: 32, delay: 0.8, opacity: 0.15 },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [item.opacity * 0.5, item.opacity, item.opacity * 0.5],
                y: [0, -30, 0],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ duration: 12 + i * 3, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
              className="absolute text-white pointer-events-none"
              style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
            >
              <item.Icon size={item.size} strokeWidth={1} />
            </motion.div>
          ))}
        </div>

      </div>
      
      {/* 1. HERO SECTION (Split Layout) */}
      <section className="relative pt-20 pb-12 lg:pt-28 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        
        {/* Local hero background elements (optional, kept for extra depth) */}
        <div className="absolute top-0 right-0 -z-10 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-ap-indigo/20 to-transparent blur-[120px]" />
        </div>

        {/* 40% Text Content */}
        <motion.div 
          className="lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-left z-10"
          initial="hidden" animate="show" variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ap-indigo/10 text-ap-indigo text-xs font-bold tracking-wider uppercase mb-6 border border-ap-indigo/30 backdrop-blur-md">
            AuraPal – Conversations Without Boundaries
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05] mb-6">
            Meet Someone <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ap-indigo via-indigo-400 to-ap-emerald">
              New in Seconds
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-slate-400 mb-8 max-w-md leading-relaxed font-medium">
            Start anonymous conversations with people around the world. No signup required.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Button
              onClick={() => navigate('/chat')}
              className="h-16 px-10 rounded-2xl bg-gradient-to-r from-ap-indigo via-[#6366F1] to-ap-emerald text-white font-black text-xl shadow-[0_12px_40px_rgb(79,70,229,0.4)] hover:shadow-[0_12px_50px_rgb(79,70,229,0.6)] transition-all hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-3 border-none ring-1 ring-white/20"
              style={{ background: 'linear-gradient(90deg, #4F46E5, #6366F1, #10B981)', backgroundSize: '200% auto' }}
            >
              Start Chatting Now <ArrowRight size={22} strokeWidth={3} />
            </Button>
            <Button
              onClick={scrollToHowItWorks}
              variant="outline"
              className="h-16 px-10 rounded-2xl border-2 border-slate-800 bg-slate-900/50 text-slate-200 font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Play size={20} className="fill-current" /> How It Works
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-sm font-bold text-slate-500">
            <div className="flex items-center gap-2 group transition-colors hover:text-amber-400"><Zap size={20} className="text-amber-500 transition-transform group-hover:scale-125"/> Instant Matching</div>
            <div className="flex items-center gap-2 group transition-colors hover:text-emerald-400"><Lock size={20} className="text-emerald-500 transition-transform group-hover:scale-125"/> Anonymous & Private</div>
            <div className="flex items-center gap-2 group transition-colors hover:text-indigo-400"><Globe size={20} className="text-indigo-500 transition-transform group-hover:scale-125"/> Global Community</div>
          </motion.div>
        </motion.div>
        {/* 60% Visual Illustration */}
        <motion.div 
          className="lg:w-7/12 relative w-full h-[400px] sm:h-[450px] z-10 flex items-center justify-center lg:justify-end"
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
        >
          {/* Glassmorphism Chat UI Preview */}
          <div className="relative w-full max-w-md aspect-[4/3] bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] p-6 flex flex-col justify-between overflow-hidden">
            
            {/* Header info */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ap-indigo to-indigo-400 flex items-center justify-center text-[10px] font-black italic shadow-inner border border-white/20">A</div>
                <div>
                   <div className="text-xs font-black text-white">Stranger #2492</div>
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Connected</span>
                   </div>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-slate-400">02:14</div>
            </div>

            {/* Chat Feed */}
            <div className="space-y-4 flex-1 overflow-hidden">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                className="self-start max-w-[85%] bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-3.5 backdrop-blur-sm"
              >
                <div className="h-1.5 w-16 bg-white/10 rounded-full mb-2"></div>
                <div className="text-sm font-medium text-slate-300">Just matched! Where are you from? 🌎</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
                className="self-end ml-auto max-w-[85%] bg-ap-indigo text-white rounded-2xl rounded-br-none p-3.5 shadow-xl shadow-ap-indigo/20"
              >
                 <div className="text-sm font-bold">New York! How about you? 🍎</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, repeat: Infinity, duration: 2 }}
                className="flex gap-1.5 items-center mt-2 pl-2"
              >
                 <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                 <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                 <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </motion.div>
            </div>

            {/* Input Mockup */}
            <div className="mt-8 flex gap-3 h-12">
              <div className="flex-1 bg-white/5 rounded-xl border border-white/10 flex items-center px-4 font-bold text-slate-600 text-xs">Type a message...</div>
              <div className="w-12 rounded-xl bg-gradient-to-br from-ap-indigo to-indigo-600 flex items-center justify-center shadow-lg shadow-ap-indigo/30">
                <ArrowRight size={20} className="text-white" strokeWidth={3} />
              </div>
            </div>

            {/* Decorative floating bubbles */}
            <motion.div animate={{ y: [0, -15, 0], rotate: [12, 15, 12] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute -top-6 -right-6 w-20 h-20 bg-[#6366F1]/20 blur-2xl rounded-full" />
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 7, delay: 0.5 }} className="absolute -bottom-8 -left-4 w-16 h-16 bg-[#10B981]/15 blur-2xl rounded-full" />

          </div>
        </motion.div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works" className="py-16 bg-[#050507] relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-white sm:text-5xl mb-6">Start Connecting in 3 Simple Steps</h2>
            <p className="text-xl text-slate-400 font-medium">No complex signups. Just instant, meaningful human connection.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {/* Step 1 */}
            <motion.div whileHover={{ y: -8 }} className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-indigo-500/10 text-ap-indigo rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(79,70,229,0.1)] border border-ap-indigo/20 transition-all duration-500 group-hover:bg-ap-indigo group-hover:text-white group-hover:scale-110">
                <Play size={40} className="fill-current" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">1. Click Start</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Instantly connect with a random user eager to talk.</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div whileHover={{ y: -8 }} className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-emerald-500/10 text-ap-emerald rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.1)] border border-ap-emerald/20 transition-all duration-500 group-hover:bg-ap-emerald group-hover:text-white group-hover:scale-110">
                <MessageSquare size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">2. Chat Freely</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Talk anonymously with strangers worldwide via text or video.</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div whileHover={{ y: -8 }} className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-orange-500/10 text-orange-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(249,115,22,0.1)] border border-orange-500/20 transition-all duration-500 group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110">
                <RefreshCw size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">3. Skip Anytime</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Not feeling the vibe? Move to a new person with one click.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. VIRAL FEATURES SHOWCASE */}
      <section className="py-16 bg-[#09090B] relative overflow-hidden">
        
        {/* Network Background Layer (Filling the 'Empty Space') */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl">
            {/* Pulsing connections */}
            {[...Array(6)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bg-ap-indigo/20 blur-3xl rounded-full"
                style={{ 
                  width: `${200 + i * 50}px`, 
                  height: `${200 + i * 50}px`,
                  top: `${20 + i * 10}%`,
                  left: `${10 + i * 15}%`,
                }}
              />
            ))}
            {/* Vertical/Horizontal Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ap-emerald/10 text-ap-emerald text-[10px] font-black tracking-widest uppercase mb-6 border border-ap-emerald/20">
                <span className="w-1.5 h-1.5 bg-ap-emerald rounded-full animate-pulse" />
                Next-Gen Experience
              </div>
              <h2 className="text-4xl font-black text-white sm:text-6xl mb-8 leading-[0.95] tracking-tighter">Features Built for Discovery</h2>
              <p className="text-xl text-slate-400 mb-12 font-medium leading-relaxed max-w-xl">We've engineered AuraPal with modern social mechanics missing from older random chat sites.</p>
              
              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  { icon: Hash, title: "Interest Matching", desc: "Talk about what you love" },
                  { icon: MessageSquare, title: "Icebreaker Prompts", desc: "Never run out of things to say" },
                  { icon: RefreshCw, title: "1-Click Skip", desc: "Instantly match with someone new" },
                  { icon: Globe, title: "Country Filter", desc: "Chat locally or globally" },
                  { icon: Users, title: "Anonymous Nicknames", desc: "Fun, auto-generated identities" },
                  { icon: Mic, title: "Voice Chat", desc: "Hands-free conversations" },
                  { icon: Video, title: "Video Chat", desc: "Premium face-to-face matching (Beta)" },
                ].map((ft, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-slate-900 border border-white/5 flex items-center justify-center text-ap-indigo shadow-lg transition-all group-hover:bg-ap-indigo group-hover:text-white">
                        <ft.icon size={24} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-ap-indigo transition-colors">{ft.title}</h4>
                      <p className="text-sm text-slate-500 font-medium">{ft.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Phone/UI Mockup (Obsidian Theme) */}
            <div className="lg:w-1/2 relative w-full flex justify-center items-center py-12">
              
              {/* Floating Live Activity Cards (Bridges the 'Empty' horizontal space) */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}
                className="absolute -left-4 top-20 hidden xl:flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl z-20 shadow-2xl"
              >
                <div className="w-8 h-8 rounded-full bg-ap-emerald/20 flex items-center justify-center text-ap-emerald">⚡</div>
                <div>
                   <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">New Connection</div>
                   <div className="text-xs font-bold text-white">Paris, France 🇫🇷</div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                className="absolute -right-8 bottom-32 hidden xl:flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl z-20 shadow-2xl"
              >
                <div className="w-8 h-8 rounded-full bg-ap-indigo/20 flex items-center justify-center text-ap-indigo">❤</div>
                <div>
                   <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global Status</div>
                   <div className="text-xs font-bold text-white">1,242 Users Live</div>
                </div>
              </motion.div>

              {/* The Central Mockup */}
              <div className="relative z-10">
                <div className="w-full max-w-[300px] bg-slate-900 rounded-[2.5rem] p-2 shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-[2px] border-slate-800 transition-all duration-700">
                  <div className="bg-[#020617] w-full h-[520px] rounded-[2.2rem] overflow-hidden flex flex-col border border-white/5 shadow-inner relative">
                    
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 pt-4 pb-2 z-20">
                      <div className="text-[10px] font-bold text-white/40">9:41</div>
                      <div className="flex gap-1.5 items-center opacity-40">
                        <div className="w-3 h-3 border border-white rounded-[2px]" />
                        <Globe size={10} className="text-white" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-ap-indigo/80 to-indigo-950 p-6 pb-8 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
                      <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="text-xs font-black tracking-tighter opacity-80 uppercase">AuraPal Match</div>
                        <div className="flex gap-2 items-center">
                          <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase">Live</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                      </div>
                      <div className="text-2xl font-black leading-tight relative z-10">Finding someone<br/>interesting...</div>
                      <div className="mt-4 flex flex-wrap gap-2 relative z-10">
                         <span className="px-2.5 py-1 bg-white/10 rounded-full text-[9px] font-black backdrop-blur-md border border-white/10 uppercase">#music</span>
                         <span className="px-2.5 py-1 bg-white/10 rounded-full text-[9px] font-black backdrop-blur-md border border-white/10 uppercase">#gaming</span>
                      </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-center items-center gap-6 relative">
                      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute w-28 h-28 bg-ap-indigo rounded-full z-0"/>
                      <div className="w-14 h-14 bg-ap-indigo rounded-full z-10 flex items-center justify-center text-white shadow-2xl shadow-ap-indigo/40 ring-4 ring-ap-indigo/20"><Globe size={24} strokeWidth={2.5}/></div>
                      <div className="text-center z-10">
                        <div className="text-base font-black text-white">Searching...</div>
                        <div className="text-[10px] text-slate-500 mt-1.5 font-black tracking-widest uppercase">Global Network Active</div>
                        
                        {/* Matching Progress Indicator */}
                        <div className="mt-4 w-24 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
                          <motion.div 
                            animate={{ x: [-96, 96] }} 
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="w-full h-full bg-gradient-to-r from-transparent via-ap-indigo to-transparent" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Activity Feed (Mock Details) */}
                    <div className="px-5 py-4 border-t border-white/5 bg-slate-900/40">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><Users size={12} className="text-slate-400" /></div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">12k+ Online Now</div>
                      </div>
                      <div className="flex justify-between gap-3">
                        <div className="flex-1 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center px-3">
                           <div className="h-1 w-10 bg-white/20 rounded-full" />
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-ap-indigo/40 flex items-center justify-center text-white"><ArrowRight size={14} strokeWidth={3}/></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* 4. SAFETY & TRUST SECTION */}
      <section className="pt-16 pb-8 bg-[#050507]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-emerald-500/10 mb-8 border border-ap-emerald/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]">
            <Shield size={48} className="text-ap-emerald" />
          </div>
          <h2 className="text-4xl font-bold text-white sm:text-5xl mb-8">Safe and Anonymous Conversations</h2>
          <p className="text-xl text-slate-400 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
            We believe in free expression, but not at the cost of safety. AuraPal utilizes cutting-edge tools to maintain a welcoming community.
          </p>

          <div className="mx-auto max-w-4xl grid sm:grid-cols-2 gap-6 text-left">
            {[
              "AI moderation system filters toxic content",
              "1-click Report and Block users",
              "100% Anonymous chatting",
              "No signup required to start",
              "Privacy-focused and secure architecture",
              "End-to-end encrypted signals"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-full bg-ap-emerald/20 flex items-center justify-center flex-shrink-0 text-ap-emerald group-hover:scale-110 transition-transform">✓</div>
                <span className="font-bold text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  )
}