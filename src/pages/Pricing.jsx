import { PricingCard } from '../components/PricingCard'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Heart } from 'lucide-react'

export function Pricing() {
  return (
    <div className="py-12 px-4 sm:py-16" style={{ background: 'var(--surface)' }}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: 'var(--text)' }}>
            Pricing & Support
          </h1>
          <p className="mt-6 text-lg leading-8" style={{ color: 'var(--muted)' }}>
            AuraPal is free to use. Support us to help keep it independent and ad-free.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <PricingCard
            name="Free"
            price="Free"
            description="Everything you need to connect authentically"
            features={[
              'Unlimited messages',
              'End-to-end encrypted conversations',
              'Interest-based matching',
              'Profile customization',
              'Privacy controls',
              'Community support',
            ]}
            cta="Get Started"
          />
          <PricingCard
            name="Premium"
            price="$4.99"
            description="Support AuraPal and get a few extras"
            features={[
              'Everything in Free',
              'Priority support',
              'Advanced matching preferences',
              'Custom profile themes',
              'Early access to new features',
              'Support independent development',
            ]}
            cta="Coming Soon"
            highlight={true}
          />
        </div>

        <div className="mt-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" style={{ color: 'var(--brand-start)' }} />
                <CardTitle style={{ color: 'var(--text)' }}>Support AuraPal</CardTitle>
              </div>
              <CardDescription style={{ color: 'var(--muted)' }}>
                Help us keep AuraPal free, independent, and ad-free. Every contribution helps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <h3 className="font-semibold" style={{ color: 'var(--text)' }}>PayPal</h3>
                  <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
                    Support us via PayPal (one-time or recurring)
                  </p>
                  {/* Scanner placeholder */}
                  <div className="mt-4 flex justify-center">
                    <img
                      src="/assets/paypal-qr.png"
                      alt="PayPal QR Code"
                      className="h-32 w-32 rounded-md border"
                      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                    />
                  </div>
                  <Button className="mt-4 w-full" variant="outline">
                    Pay with PayPal
                  </Button>
                </div>

                <div className="rounded-lg border p-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Cash App</h3>
                  <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
                    Send support via Cash App
                  </p>
                  {/* Scanner placeholder */}
                  <div className="mt-4 flex justify-center">
                    <img
                      src="/assets/cashapp-qr.png"
                      alt="Cash App QR Code"
                      className="h-32 w-32 rounded-md border"
                      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                    />
                  </div>
                  <Button className="mt-4 w-full" variant="outline">
                    Pay with Cash App
                  </Button>
                </div>
              </div>
              <p className="mt-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
                Stripe subscriptions coming soon. PayPal and Cash App QR codes above can be scanned directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}