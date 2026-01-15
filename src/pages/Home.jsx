import { FeatureCard } from '../components/FeatureCard'
import { Button } from '../components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Lock, Heart, Users } from 'lucide-react'

export function Home() {
  const navigate = useNavigate()

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'var(--surface)' }}
        aria-labelledby="home-hero-title"
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--muted)' }}
            >
              Privacy-first • No phone number • Safety-first matching
            </p>

            <h1
              id="home-hero-title"
              className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
              style={{ color: 'var(--ap-accent)' }}
            >
              Real People. Real Connection.
            </h1>

            <p className="mt-4 text-base sm:text-lg" style={{ color: 'var(--muted)' }}>
              Connect instantly with people who value privacy and meaningful conversation — no tracking, no
              algorithms.
            </p>

            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Button
                size="lg"
                className="w-full sm:w-auto font-semibold rounded-full shadow-md"
                onClick={() => navigate('/chat?mode=text')}
                style={{ background: 'var(--brand-gradient)', color: '#fff' }}
                aria-label="Start chatting now"
              >
                Start Chatting Now
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border"
                onClick={() => navigate('/signin')}
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                aria-label="Sign in"
              >
                Sign In
              </Button>
            </div>

            <div className="mt-6 text-sm" style={{ color: 'var(--muted)' }}>
              End-to-end encrypted • No tracking • Real people, no bots
            </div>

            <div className="mt-4 text-sm text-slate-300 italic">“Feels real — met great people here”</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="py-10 sm:py-12 lg:py-14 px-4"
        style={{ background: 'var(--surface)' }}
        aria-labelledby="how-it-works-title"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2
              id="how-it-works-title"
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ color: 'var(--text)' }}
            >
              How it works
            </h2>
            <p className="mt-3 text-base sm:text-lg" style={{ color: 'var(--muted)' }}>
              Three simple steps to start connecting mindfully
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="text-center">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ background: 'rgba(124,58,237,0.12)' }}
                  aria-hidden
                >
                  <span className="text-xl font-bold" style={{ color: 'var(--ap-accent)' }}>
                    {n}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold" style={{ color: 'var(--text)' }}>
                  {n === 1 ? 'Sign Up' : n === 2 ? 'Share Your Interests' : 'Connect Safely'}
                </h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
                  {n === 1
                    ? 'Create your account with just your email. No phone number required.'
                    : n === 2
                    ? "Tell us what matters to you. We'll help you find like-minded people."
                    : 'Start meaningful conversations with encrypted messaging.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 sm:py-12 lg:py-14 px-4" style={{ background: 'var(--surface)' }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: 'var(--text)' }}>
              Why AuraPal?
            </h2>
            <p className="mt-3 text-base sm:text-lg" style={{ color: 'var(--muted)' }}>
              Built for people who value privacy and authentic connection
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={Shield}
              title="Zero Data Exploitation"
              description="We don't track you or sell your data."
            />
            <FeatureCard
              icon={Lock}
              title="End-to-End Encryption"
              description="Only you and your chat partner can read messages."
            />
            <FeatureCard
              icon={Heart}
              title="Mindful Matching"
              description="Connect based on shared interests and values."
            />
            <FeatureCard
              icon={Users}
              title="Safe Community"
              description="Moderation tools keep AuraPal welcoming."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-10 sm:py-12 lg:py-14 px-4" style={{ background: 'var(--surface)' }}>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: 'var(--text)' }}>
            Ready to connect authentically?
          </h2>
          <p className="mt-3 text-base sm:text-lg" style={{ color: 'var(--muted)' }}>
            Join a community that values privacy, safety, and real human connection.
          </p>

          <div className="mt-6">
            <Button
              asChild
              size="lg"
              className="rounded-full px-6 py-3"
              style={{ background: 'var(--brand-gradient)', color: '#fff' }}
            >
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
            <Link to="/pricing" style={{ color: 'var(--ap-accent)' }}>
              Support us
            </Link>{' '}
            to help keep AuraPal free and independent.
          </p>
        </div>
      </section>
    </>
  )
}