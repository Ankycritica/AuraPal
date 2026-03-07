import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { trackEvent } from '../lib/analytics'

export function PremiumCheckout() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubscribe = () => {
        trackEvent('clicked_subscribe', { tier: 'pro' })
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setSuccess(true)
            trackEvent('subscription_success', { tier: 'pro', value: 9.99 })
        }, 1500)
    }

    if (success) {
        return (
            <div className="min-h-screen bg-ap-dark flex items-center justify-center p-6 text-center">
                <div className="max-w-md bg-surface p-8 rounded-2xl border border-white/5 shadow-2xl">
                    <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✨</div>
                    <h2 className="text-2xl font-bold text-text mb-2">Welcome to Premium</h2>
                    <p className="text-muted mb-6">Your account has been upgraded. Enjoy priority matching and exclusive features.</p>
                    <Button className="w-full bg-brand-gradient text-on-brand font-medium hover:opacity-90" onClick={() => window.location.href = '/'}>
                        Return Home
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-ap-dark py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-12">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-brand-gradient tracking-tight sm:text-5xl">
                        AuraPal Premium
                    </h1>
                    <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
                        Experience the internet's most refined video chat. No waiting, full control.
                    </p>
                </div>

                <div className="bg-surface rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-brand-start rounded-full opacity-20 blur-3xl" />

                    <div className="p-8 sm:p-10 lg:p-12">
                        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-text">Pro Membership</h3>
                                <p className="text-muted mt-1">Unlock everything</p>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-extrabold text-text">$9.99<span className="text-xl text-muted font-medium">/mo</span></p>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {['Priority Matchmaking queue', 'Exclusive Gender Filters', 'Ad-free Experience', 'Premium Profile Badge'].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="p-1 rounded-full bg-ap-warm/10 text-ap-warm border border-ap-warm/20">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-text">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            onClick={handleSubscribe}
                            disabled={loading}
                            className="w-full h-14 text-lg font-medium bg-brand-gradient text-on-brand shadow-lg hover:opacity-90 transition-opacity"
                        >
                            {loading ? 'Processing...' : 'Upgrade Now'}
                        </Button>
                        <p className="text-center text-xs text-muted mt-4">Secure payment powered by Stripe. Cancel anytime.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
