import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy — AuraPal'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-slate-400 mb-12">Last updated: March 27, 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Overview</h2>
            <p className="text-slate-300 leading-relaxed">
              AuraPal is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our Service. Our core principle is simple: <strong>we collect minimal data, and we never sell your information</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <p className="text-slate-300 leading-relaxed mb-4">AuraPal is designed to work without requiring personal information:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li><strong>No account required</strong> — You can chat without signing up</li>
              <li><strong>No personal data stored</strong> — Chat conversations are not logged or saved</li>
              <li><strong>Anonymous sessions</strong> — We use temporary session IDs that are discarded after use</li>
              <li><strong>Optional preferences</strong> — Interest tags and display names are stored locally in your browser only</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Information</h2>
            <p className="text-slate-300 leading-relaxed">
              Any minimal technical data we process (such as IP addresses for rate limiting) is used solely for service operation, security, and abuse prevention. We do not use this data for advertising, profiling, or any commercial purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing</h2>
            <p className="text-slate-300 leading-relaxed">
              We do not sell, trade, or transfer your information to third parties. We may share limited technical data with law enforcement when required by law, such as in cases involving illegal activity or exploitation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Cookies & Local Storage</h2>
            <p className="text-slate-300 leading-relaxed">
              AuraPal uses browser localStorage to save your preferences (theme, display name, interests). These are stored entirely on your device and are never transmitted to our servers. You can clear this data at any time through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Children's Privacy</h2>
            <p className="text-slate-300 leading-relaxed">
              AuraPal is not intended for use by anyone under the age of 18. We do not knowingly collect information from minors. If we become aware that a minor is using the Service, we will take steps to terminate their access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
            <p className="text-slate-300 leading-relaxed">
              Since AuraPal does not maintain user accounts or store personal data, there is minimal data to request deletion of. If you have concerns about your privacy, please contact us at <a href="mailto:privacy@aurapal.org" className="text-ap-indigo hover:underline">privacy@aurapal.org</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Changes to This Policy</h2>
            <p className="text-slate-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Your continued use of the Service constitutes acceptance of any changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
