# Project Specification: AuraPal Luxe

**Status: FINALIZED**

## Vision
Transform AuraPal from a "dark hacker/obsidian" aesthetic to a "light and expensive" premium experience. Focus on world-class whitespace, soft typography, and glassmorphism that feels like high-end stationery or a luxury banking app.

## Core Requirements

### 1. "Light & Expensive" Visual Language
- **Background**: Replace deep black/navy with a refined off-white/warm-grey palette (`#FAFAFA` / `#F5F5F7`).
- **Typography**: Minimalist, high-contrast text. Use `Inter` or `Outfit` with refined tracking.
- **Glassmorphism**: "Luxe Frost" — White translucent overlays with extreme `blur-[20px]` and 1px borders using `neutral-100`.
- **Accents**: Sophisticated muted gold (`#C29543`) or soft indigo (`#6366F1`) used sparingly.
- **Background Effects**: Soften the "Starfield" and "Connectivity Mesh" to be extremely subtle, using light pastels instead of neon emerald/indigo.

### 2. Functional Rules
- **Add Friend (+friend)**: 
    - Logic: Both users MUST be authenticated (not `isGuest`).
    - Feedback: If either user is a guest, disable the button or show a tooltip/toast: *"Both users must be signed up to add friends."*
- **Auth Expansion**:
    - Integrate Google and Apple sign-in options into `SignIn.jsx` and `SignUp.jsx` using the existing `SocialButtons` component.
- **Explainable Interface**: 
    - Every toggle, filter, and control (Video, Mic, Gender Filters, etc.) must have a "Reason" provided via Tooltips or clear descriptive labels (e.g. *"Gender filter requires Premium"*).

### 3. Navigation
- Maintain the 4-column footer structure but update styling for the light theme.

## Success Metrics
- 100% of UI sections transitioned to light theme.
- Friend request button successfully blocked for guest-to-authenticated pairs.
- No "mysterious" icons; all controls have hover states with explanations.
