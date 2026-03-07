// src/hooks/useFeatureFlags.js
import { useState, useEffect } from 'react'

/**
 * Feature Flag & A/B testing hook stub.
 * In a real app, this would fetch from LaunchDarkly, Statsig, or Optimizely.
 */
const defaultFlags = {
    'enable-premium-billing': true,
    'upsell-variant': 'control', // 'control' or 'aggressive'
    'show-referrals': true,
}

export function useFeatureFlags() {
    const [flags, setFlags] = useState(defaultFlags)

    useEffect(() => {
        // Stub: Simulate fetching flags from a provider
        const fetchFlags = async () => {
            // Simulate network
            await new Promise(r => setTimeout(r, 200))
            // For now, just keep default 
            // If we wanted to randomise A/B test variant based on user ID:
            const variant = Math.random() > 0.5 ? 'aggressive' : 'control'
            setFlags(prev => ({ ...prev, 'upsell-variant': variant }))
        }
        fetchFlags()
    }, [])

    const getFlag = (flagName) => flags[flagName]

    return { flags, getFlag }
}
