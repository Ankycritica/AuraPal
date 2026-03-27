import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, AlertTriangle, Ban, Heart, Users } from 'lucide-react'

export function CommunityGuidelines() {
  useEffect(() => {
    document.title = 'Community Guidelines — AuraPal'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Community Guidelines</h1>
        <p className="text-slate-400 mb-12">Creating a safe, respectful space for everyone.</p>

        {/* Key Message */}
        <div className="p-6 rounded-2xl bg-ap-indigo/10 border border-ap-indigo/20 mb-12">
          <p className="text-white font-bold text-lg mb-2">AuraPal is a platform for meaningful conversations.</p>
          <p className="text-slate-300">
            We are NOT a dating platform. We exist to foster genuine human connection through anonymous, respectful conversation. Every user is expected to follow these guidelines.
          </p>
        </div>

        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                <Ban size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Zero Tolerance Policy</h2>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">The following will result in an immediate and permanent ban:</p>
            <ul className="space-y-3">
              {[
                'Nudity, sexual content, or sexually explicit behavior',
                'Harassment, bullying, threats, or hate speech',
                'Sharing content involving the exploitation of minors',
                'Doxxing or sharing others\' personal information',
                'Illegal activities including drug solicitation',
                'Spam, scams, or commercial solicitation',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                  <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-ap-emerald/10 flex items-center justify-center text-ap-emerald">
                <Heart size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Be Respectful</h2>
            </div>
            <ul className="space-y-3">
              {[
                'Treat every person with dignity, regardless of their background',
                'If someone asks you to stop, respect their boundaries',
                'Use the Skip button if a conversation isn\'t working for you',
                'Remember that there is a real human on the other side',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-ap-emerald/5 border border-ap-emerald/10">
                  <Shield size={16} className="text-ap-emerald mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-ap-indigo/10 flex items-center justify-center text-ap-indigo">
                <Users size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Moderation & Reporting</h2>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              AuraPal uses AI-powered moderation to detect and prevent harmful behavior. Additionally:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-2">
              <li>You can report any user with a single click during a conversation</li>
              <li>You can block users to prevent future matches</li>
              <li>All reports are reviewed and acted upon promptly</li>
              <li>We cooperate with law enforcement when legally required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Age Requirement</h2>
            <p className="text-slate-300 leading-relaxed">
              You must be at least <strong>18 years old</strong> to use AuraPal. We take this seriously and will take action to remove underage users from the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have questions about these guidelines or want to report a safety concern, contact us at{' '}
              <a href="mailto:safety@aurapal.org" className="text-ap-indigo hover:underline">safety@aurapal.org</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
