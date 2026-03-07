// src/lib/analytics.js
/**
 * Analytics Stub
 * In production this would route to Mixpanel, Amplitude, or Google Analytics.
 */

export const trackEvent = (eventName, properties = {}) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[Analytics] Track: ${eventName}`, properties)
    }

    // Example actual implementation:
    // window.mixpanel?.track(eventName, properties)
}

export const setUserProperties = (properties) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[Analytics] Set User Properties:`, properties)
    }
}
