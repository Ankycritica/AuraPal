import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'
import { Shield, AlertTriangle, Users, Heart } from 'lucide-react'

export function Safety() {
  return (
    <div className="py-12 px-4 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Safety & Community Guidelines</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our commitment to keeping AuraPal a safe and welcoming space
          </p>
        </div>

        <div className="mt-16 space-y-12">
          <section>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Our Commitment</h2>
                <p className="mt-4 text-muted-foreground">
                  AuraPal is built on the principles of respect, safety, and authentic connection.
                  We're committed to creating a space where everyone can feel safe to be themselves
                  and connect with others.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Community Guidelines</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary-600" />
                    Be Respectful
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Treat everyone with kindness and respect. We're all here to connect authentically,
                    and that means being considerate of others' feelings and boundaries.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary-600" />
                    Authentic Profiles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Use your real identity and be honest about who you are. Fake profiles, impersonation,
                    and misleading information are not allowed.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary-600" />
                    No Harassment or Abuse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Harassment, bullying, threats, hate speech, and any form of abuse will not be
                    tolerated. This includes unwanted advances, discriminatory language, and any behavior
                    that makes others feel unsafe.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>No Spam or Scams</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Don't spam, send unsolicited messages, or attempt to scam other users. This includes
                    phishing attempts, financial scams, and any form of fraudulent activity.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Respect Privacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Don't share others' personal information without permission. Respect boundaries and
                    don't pressure others to share more than they're comfortable with.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Reporting & Moderation</h2>
            <Card>
              <CardHeader>
                <CardTitle>How to Report</CardTitle>
                <CardDescription>
                  If you encounter behavior that violates our guidelines, please report it
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Reporting a User</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You can report a user from their profile, in a conversation, or from the user menu.
                    Select the reason for reporting and provide any additional context.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Harassment or bullying</li>
                    <li>Spam or scams</li>
                    <li>Inappropriate content</li>
                    <li>Fake profile</li>
                    <li>Other violations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What Happens Next</h3>
                  <p className="text-sm text-muted-foreground">
                    All reports are reviewed by our moderation team. We take every report seriously
                    and will take appropriate action, which may include warnings, temporary suspensions,
                    or permanent bans.
                  </p>
                </div>
                <div className="pt-4">
                  <Button asChild>
                    <Link to="/dashboard">Go to Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Safety Tools</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Block & Ignore</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    You can block or ignore any user at any time. Blocked users won't be able to contact
                    you, and their conversations will be hidden from your inbox.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Control who can see your profile and contact you. Make your profile private, adjust
                    visibility settings, and manage your privacy preferences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="rounded-lg border bg-primary-50 p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              If you have questions about safety or need to report something urgent, we're here to help.
            </p>
            <Button variant="outline">
              Contact Support
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              TODO: Add support contact form or email
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

