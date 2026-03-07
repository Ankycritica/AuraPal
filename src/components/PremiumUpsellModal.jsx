import React from 'react'
import { Button } from './ui/button'

export function PremiumUpsellModal({ open, onOpenChange }) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                <h2 className="text-xl font-semibold text-amber-400 mb-2">Unlock Premium</h2>
                <p className="text-sm text-slate-300 mb-6">Get more control over your AuraPal experience.</p>

                <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                        <span className="text-amber-500 bg-amber-500/10 p-2 rounded-lg">🚀</span>
                        <div>
                            <p className="text-sm font-medium text-slate-200">Priority Matching</p>
                            <p className="text-xs text-slate-400">Skip the line and connect significantly faster.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-amber-500 bg-amber-500/10 p-2 rounded-lg">🎯</span>
                        <div>
                            <p className="text-sm font-medium text-slate-200">Gender Filters</p>
                            <p className="text-xs text-slate-400">Choose exactly who you want to meet without random matches.</p>
                        </div>
                    </li>
                </ul>

                <div className="flex justify-end gap-3 font-semibold">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800">
                        Maybe Later
                    </Button>
                    <Button onClick={() => onOpenChange(false)} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-500/20">
                        Upgrade Now
                    </Button>
                </div>
            </div>
        </div>
    )
}
