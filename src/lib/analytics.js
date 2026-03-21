// src/lib/analytics.js
/**
 * Analytics Stub
 * In production this would route to Mixpanel, Amplitude, or Google Analytics.
 */

export const trackEvent = (eventName, properties = {}) => {
    if (import.meta.env.DEV) {
        console.log(`[Analytics] Track: ${eventName}`, properties)
    }

    // Example actual implementation:
    // window.mixpanel?.track(eventName, properties)
}

export const setUserProperties = (properties) => {
    if (import.meta.env.DEV) {
        console.log(`[Analytics] Set User Properties:`, properties)
    }
}
