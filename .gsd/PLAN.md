# Plan: AuraPal Luxe Overhaul

**Status: DRAFT**

## Overview
A complete visual and functional refinement to transform AuraPal into a high-end, "light and expensive" communication platform.

## Waves

### 🌊 Wave 1 — Foundation (Theme Shift)

<task type="auto">
  <name>Define Luxe Light Theme</name>
  <files>src/styles/theme.css, src/index.css</files>
  <action>
    - Swap default :root to be the light theme.
    - Define "--ap-luxe-bg: #FAFAFA" and "--ap-luxe-surface: #FFFFFF".
    - Update text color to a soft slate-dark.
    - Define a new ".luxe-frost" glassmorphism class with 1px light border and high blur.
  </action>
  <verify>Check contrast ratios and verify body background is now off-white.</verify>
  <done>Global variables updated to Luxe Light palette.</done>
</task>

<task type="auto">
  <name>Home Hero & Background Migration</name>
  <files>src/pages/Home.jsx</files>
  <action>
    - Remove hardcoded "#09090B" and "#020617" backgrounds.
    - Adapt the "Billionaire Background" to a "Luxe Light" version (soft pastel indigo/emerald blobs on white).
    - Update hero text gradients to use deeper, sophisticated colors (e.g., deep indigo to teal).
    - Refactor hero shadow to be softer and more diffuse.
  </action>
  <verify>Hero section looks clean, airy, and premium in the browser.</verify>
  <done>Home landing page fully transitioned to light mode.</done>
</task>

### 🌊 Wave 2 — Component & Footer Polish

<task type="auto">
  <name>Footer & Section Transitions</name>
  <files>src/components/Footer.jsx, src/pages/Home.jsx</files>
  <action>
    - Update Footer component to a light-mode variant (soft grey background, dark text).
    - Ensure smooth spacing and high-end padding between Home sections.
    - Update all "Features" icons to a refined minimalist stroke.
  </action>
  <verify>Visual audit of the scrolling experience from Hero to Footer.</verify>
  <done>All landing components match the Luxe Light vision.</done>
</task>

### 🌊 Wave 3 — Functional Logic & Tooltips

<task type="auto">
  <name>OAuth Integration</name>
  <files>src/pages/SignIn.jsx, src/pages/SignUp.jsx</files>
  <action>
    - Import and add `SocialButtons` component to both SignIn and SignUp pages.
    - Style the buttons to match the new Luxe Light aesthetic.
    - Ensure proper spacing and divider between email login and social options.
  </action>
  <verify>Check both pages to see if Google and Apple buttons are present and styled correctly.</verify>
  <done>OAuth options available for all users.</done>
</task>

<task type="auto">
  <name>Dual-Auth Friend Logic</name>
  <files>src/components/VideoChat.jsx, src/components/TextChat.jsx, server/server.js</files>
  <action>
    - Update server metadata broadcast to include "isGuest" for both users.
    - In handleAddFriend, check if both users are signed up.
    - Show descriptive error toast if either is a guest.
  </action>
  <verify>Simulate Guest vs Member chat and verify "Add Friend" logic blocks correctly.</verify>
  <done>Friend logic enforced as per spec.</done>
</task>

<task type="auto">
  <name>Explainable Controls (Tooltips)</name>
  <files>src/components/VideoChat.jsx, src/components/ChatControls.jsx</files>
  <action>
    - Add help/reason tooltips to Gender Filters, Mic/Video toggles, and Skip button.
    - Ensure every interactive element has a clear hover "reason".
  </action>
  <verify>Hover over all chat controls and verify tooltips appear.</verify>
  <done>Every option has a clear reason for its existence/state.</done>
</task>
