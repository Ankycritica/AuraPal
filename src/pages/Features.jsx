import { FeatureCard } from '../components/FeatureCard'
import { Shield, Lock, Heart, Users, Eye, MessageSquare } from 'lucide-react'

export function Features() {
  return (
    <div className="py-12 px-4 sm:py-16" style={{ background: 'var(--surface)' }}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: 'var(--text)' }}>
            Features — HMR route test
          </h1>
          <p className="mt-6 text-lg leading-8" style={{ color: 'var(--muted)' }}>
            Everything you need for safe, private, and meaningful connections
          </p>
        </div>

        <div className="mt-16 space-y-20">
          {/* Encrypted Messaging */}
          <section>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Lock className="h-6 w-6" style={{ color: 'var(--brand-start)' }} />
                </div>
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
                  Encrypted Messaging
                </h2>
                <p className="mt-4" style={{ color: 'var(--muted)' }}>
                  All your conversations are end-to-end encrypted. This means only you and the
                  person you're talking to can read your messages—not even we can see them.
                </p>
                <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
                  <strong>Note:</strong> In this demo, encryption is mocked. TODO: Integrate with
                  real end-to-end encryption service (e.g., Signal Protocol, Matrix).
                </p>
              </div>
              <div
                className="rounded-lg border p-8"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
                    <Lock className="h-4 w-4" />
                    <span>Messages are end-to-end encrypted</span>
                  </div>
                  <div className="rounded-lg p-4 shadow-sm" style={{ background: 'var(--surface)' }}>
                    <p className="text-sm" style={{ color: 'var(--text)' }}>Your secure messages appear here...</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy Controls */}
          <section>
            <div className="grid gap-8 md:grid-cols-2">
              <div
                className="order-2 md:order-1 rounded-lg border p-8"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" style={{ color: 'var(--brand-start)' }} />
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>Privacy Controls</span>
                  </div>
                  <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
                    <li>• Control who can see your profile</li>
                    <li>• Choose what information to share</li>
                    <li>• No tracking or behavioral analytics</li>
                    <li>• Data stays on your device when possible</li>
                  </ul>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Shield className="h-6 w-6" style={{ color: 'var(--brand-start)' }} />
                </div>
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
                  Zero Data Exploitation
                </h2>
                <p className="mt-4" style={{ color: 'var(--muted)' }}>
                  We don't track your behavior, sell your data, or use algorithms to manipulate
                  what you see. Your privacy is protected by design.
                </p>
                <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
                  Analytics are disabled by default. You can opt-in if you want to help us improve
                  the platform, but it's completely optional.
                </p>
              </div>
            </div>
          </section>

          {/* Mindful Design */}
          <section>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Heart className="h-6 w-6" style={{ color: 'var(--brand-start)' }} />
                </div>
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
                  Mindful Design
                </h2>
                <p className="mt-4" style={{ color: 'var(--muted)' }}>
                  No infinite scrolls, no engagement-maximizing algorithms, no notifications designed
                  to keep you hooked. AuraPal is designed to support meaningful connections, not
                  addiction.
                </p>
                <p className="mt-4" style={{ color: 'var(--muted)' }}>
                  Connect based on shared interests and values. See suggested matches with mutual
                  interests highlighted, and start conversations that matter.
                </p>
              </div>
              <div
                className="rounded-lg border p-8"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="space-y-4">
                  <div className="rounded-lg p-4 shadow-sm" style={{ background: 'var(--surface)' }}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold" style={{ color: 'var(--text)' }}>Suggested Match</span>
                      <span className="text-sm" style={{ color: 'var(--brand-start)' }}>85% match</span>
                    </div>
                    <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
                      Mutual interests: hiking, nature
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Safety Tools */}
          <section>
            <div className="grid gap-8 md:grid-cols-2">
              <div
                className="order-2 md:order-1 rounded-lg border p-8"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" style={{ color: 'var(--brand-start)' }} />
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>Safety Tools</span>
                  </div>
                  <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
                    <li>• Report users for inappropriate behavior</li>
                    <li>• Block or ignore unwanted contacts</li>
                    <li>• Community guidelines and moderation</li>
                    <li>• Clear reporting and review process</li>
                  </ul>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Users className="h-6 w-6" style={{ color: 'var(--brand-start)' }} />
                </div>
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
                  Safety & Community Moderation
                </h2>
                <p className="mt-4" style={{ color: 'var(--muted)' }}>
                  We provide robust tools for reporting, blocking, and moderation to keep AuraPal a
                  safe and welcoming space for everyone.
                </p>
                <p className="mt-4" style={{ color: 'var(--muted)' }}>
                  Our community guidelines are clear, and we take reports seriously. Every report is
                  reviewed by our moderation team and handled according to our policies.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={Eye}
            title="Visibility Controls"
            description="Choose who can see your profile and contact you. Make it public, private, or somewhere in between."
          />
          <FeatureCard
            icon={MessageSquare}
            title="Rich Conversations"
            description="Send messages, share interests, and build connections through meaningful conversations."
          />
          <FeatureCard
            icon={Heart}
            title="Interest-Based Matching"
            description="Find people who share your passions and values, not just random profiles."
          />
        </div>
      </div>
    </div>
  )
}