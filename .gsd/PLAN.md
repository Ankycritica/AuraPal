# Plan: Build Stability & Lint Cleanup

**Status: IN-PROGRESS**

## Overview
A high-priority cleanup of linting and build errors to ensure stable deployment and continuous integration.

## Waves

### 🌊 Wave 1 — Configuration & Global Setup
<task type="auto">
  <name>Fix Tailwind Duplicate Keys</name>
  <files>tailwind.config.js</files>
  <action>
    - Remove duplicate 'muted' key from theme.extend.colors.
  </action>
  <verify>Run `npm run lint` and verify no error in tailwind.config.js.</verify>
  <done>Tailwind config is valid.</done>
</task>

<task type="auto">
  <name>Jest Environment Globals</name>
  <files>tests/**/*.test.js, src/**/__tests__/*.jsx</files>
  <action>
    - Add `/* eslint-env jest */` to the top of all test files.
  </action>
  <verify>Lint check passes for test files.</verify>
  <done>Jest globals recognized by ESLint.</done>
</task>

### 🌊 Wave 2 — React Hook Purity (Math.random)
<task type="auto">
  <name>Stabilize JSX Randomness</name>
  <files>src/pages/Home.jsx, src/components/VideoChat.jsx</files>
  <action>
    - Move `Math.random()` calls (stars, orbs, backgrounds) into `useMemo` hooks.
  </action>
  <verify>UI renders correctly and lint errors for `react-hooks/purity` are resolved.</verify>
  <done>Dynamic elements are stabilized via hooks.</done>
</task>

### 🌊 Wave 3 — Code Hygiene (Unused Vars & Empty Blocks)
<task type="auto">
  <name>Cleanup Zustand & Sockets</name>
  <files>src/store/useStore.js, src/api/socket.js</files>
  <action>
    - Remove unused variables.
    - Add meaningful comments to empty blocks.
    - Replace `process.env` with `import.meta.env`.
  </action>
  <verify>Build passes with zero lint warnings.</verify>
  <done>Codebase is clean and follows modern Vite standards.</done>
</task>

### 🌊 Wave 4 — Verification & Deployment
<task type="auto">
  <name>Final Build & Push</name>
  <files>Entire repo</files>
  <action>
    - Run `npm run build`.
    - `git add .`, `git commit -m "Fix: Lint cleanup + build stability"`.
    - `git push origin main`.
  </action>
  <verify>Successful push to GitHub.</verify>
  <done>Stable build deployed to main.</done>
</task>
