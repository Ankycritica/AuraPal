import React, { useState } from 'react'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
import { trackEvent } from '../lib/analytics'

export function ReferralFlow() {
    const { toast } = useToast()
    const [inviteCode] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase())

    const copyLink = () => {
        trackEvent('copied_referral_link')
        navigator.clipboard.writeText(`https://aurapal.com/invite/${inviteCode}`)
        toast({
            title: "Link Copied!",
            description: "Share this link with friends to earn rewards."
        })
    }

    return (
        <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-text">Invite Friends, Get Premium</h3>
                    <p className="text-sm text-muted mt-1">Earn 1 week of Premium for every friend who joins.</p>
                </div>
                <div className="text-4xl">🎁</div>
            </div>

            <div className="flex gap-2">
                <div className="flex-1 bg-ap-dark border border-white/10 rounded-lg px-4 py-2 flex items-center overflow-hidden">
                    <span className="text-slate-400 text-sm truncate">aurapal.com/invite/</span>
                    <span className="text-ap-warm font-semibold text-sm">{inviteCode}</span>
                </div>
                <Button onClick={copyLink} className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
                    Copy
                </Button>
            </div>

            <div className="mt-6 flex gap-4 text-center">
                <div className="flex-1 p-3 rounded-lg bg-white/5">
                    <p className="text-2xl font-bold text-text">0</p>
                    <p className="text-xs text-muted uppercase tracking-wider">Invites</p>
                </div>
                <div className="flex-1 p-3 rounded-lg bg-brand-start/10 border border-brand-start/20">
                    <p className="text-2xl font-bold text-brand-start">0</p>
                    <p className="text-xs text-brand-start uppercase tracking-wider">Weeks Earned</p>
                </div>
            </div>
        </div>
    )
}
