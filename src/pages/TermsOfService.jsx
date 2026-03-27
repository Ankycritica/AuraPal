import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function TermsOfService() {
  useEffect(() => {
    document.title = 'Terms of Service — AuraPal'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Terms of Service</h1>
        <p className="text-slate-400 mb-12">Last updated: March 27, 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing or using AuraPal ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use the Service. AuraPal reserves the right to modify these terms at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="text-slate-300 leading-relaxed">
              AuraPal is a platform for anonymous, moderated conversations and global social discovery. AuraPal is <strong>not</strong> a dating platform. The Service connects users for text and video conversations in a safe, monitored environment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Eligibility</h2>
            <p className="text-slate-300 leading-relaxed">
              You must be at least 18 years of age to use AuraPal. By using the Service, you represent and warrant that you meet this age requirement. AuraPal does not knowingly allow minors to use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. User Conduct</h2>
            <p className="text-slate-300 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Share, transmit, or display any adult, explicit, or sexually suggestive content</li>
              <li>Harass, bully, threaten, or intimidate other users</li>
              <li>Share personal information of others without consent</li>
              <li>Use the Service for illegal activities</li>
              <li>Attempt to circumvent moderation or safety systems</li>
              <li>Impersonate other individuals or entities</li>
              <li>Spam, advertise, or promote products/services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Content Moderation</h2>
            <p className="text-slate-300 leading-relaxed">
              AuraPal employs AI-based moderation and human review processes to ensure compliance with community standards. We reserve the right to terminate access for any user who violates these terms without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. No Adult Content</h2>
            <p className="text-slate-300 leading-relaxed">
              AuraPal strictly prohibits adult content, nudity, sexually explicit material, and any form of exploitation. Violations will result in immediate and permanent ban. We cooperate with law enforcement agencies as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
            <p className="text-slate-300 leading-relaxed">
              AuraPal is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Service, including but not limited to interactions with other users. Use AuraPal at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Termination</h2>
            <p className="text-slate-300 leading-relaxed">
              We may suspend or terminate your access to the Service at any time, for any reason, without notice. Upon termination, your right to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Contact</h2>
            <p className="text-slate-300 leading-relaxed">
              For questions about these Terms of Service, please contact us at <a href="mailto:legal@aurapal.org" className="text-ap-indigo hover:underline">legal@aurapal.org</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
