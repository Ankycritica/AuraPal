import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export function About() {
  return (
    <div className="py-12 px-4 sm:py-16" style={{ background: 'var(--surface)' }}>
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: 'var(--text)' }}>
            Our Mission
          </h1>
          <p className="mt-6 text-lg leading-8" style={{ color: 'var(--muted)' }}>
            Building a privacy-first platform for authentic human connection
          </p>
        </div>

        <div className="mt-16 space-y-12">
          <section>
            <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
              Why AuraPal Exists
            </h2>
            <p className="mt-4" style={{ color: 'var(--muted)' }}>
              In a world where social platforms exploit our data and manipulate our attention, we
              believe there's a better way. AuraPal was created to give people a space to connect
              authentically—without surveillance, without algorithms designed to keep you scrolling,
              and without selling your personal information.
            </p>
            <p className="mt-4" style={{ color: 'var(--muted)' }}>
              We're building a community where privacy is the default, where conversations are
              encrypted, and where connections are based on shared interests and values, not
              addictive feeds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
              Our Values
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle style={{ color: 'var(--text)' }}>Privacy First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Your data belongs to you. We collect only what's necessary and never sell or
                    share it with third parties.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle style={{ color: 'var(--text)' }}>Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    We're open about how our platform works, what data we collect, and how we use
                    it.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle style={{ color: 'var(--text)' }}>Safety</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    We provide tools for reporting, blocking, and moderation to keep our community
                    safe and welcoming.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle style={{ color: 'var(--text)' }}>Authentic Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    We prioritize meaningful interactions over engagement metrics and endless
                    scrolling.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
              The Team
            </h2>
            <p className="mt-4" style={{ color: 'var(--muted)' }}>
              AuraPal is built by a small team of developers, designers, and community moderators
              who believe in creating technology that serves people, not corporations.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--brand-start)' }}
                  >
                    <span className="text-xl font-semibold">F</span>
                  </div>
                  <CardTitle className="mt-4" style={{ color: 'var(--text)' }}>
                    Founder
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Building AuraPal to create a better alternative to existing social platforms.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--brand-start)' }}
                  >
                    <span className="text-xl font-semibold">T</span>
                  </div>
                  <CardTitle className="mt-4" style={{ color: 'var(--text)' }}>
                    Team Member
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Contributing to development, design, and community moderation.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--brand-start)' }}
                  >
                    <span className="text-xl font-semibold">C</span>
                  </div>
                  <CardTitle className="mt-4" style={{ color: 'var(--text)' }}>
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Our community of users and moderators who help keep AuraPal safe and welcoming.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}