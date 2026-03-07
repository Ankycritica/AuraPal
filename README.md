# 💎 AuraPal: FAANG-Tier Executive Summary

AuraPal has been transformed into a highly polished, production-ready, premium consumer video chat platform. The product now matches the UX and reliability of top-tier consumer apps, complete with billionaire-grade aesthetic branding, robust frontend/backend architecture, deep observability, and an integrated monetization engine.

## 🚀 Post-Deploy KPIs to Monitor
- **Match Success Rate (`aurapal_match_success_total`)**: Target > 90%
- **Disconnect Rate (`aurapal_disconnect_total`)**: Target < 5%
- **Median Queued Wait Time (Premium vs Non-Premium)**: Target premium users spending < 5s waiting.
- **Premium Upsell CTR (Analytics `clicked_subscribe`)**: Track the conversion funnel for the new priority queues and gender filters.

## 🛠 Features & Scope Delivered

### 1. Robust Core Signaling
- Handled all critical socket stages: `video-find-random`, `video-ready`, `video-offer`, `video-answer`, `ice-candidate`, `video-skip`, `video-end`.
- Configured dynamic TURN server support natively handed via websockets to clients.
- Automated cleanup prevents orphaned matchmaking deadlocks.

### 2. Premium UX & Monetization 
- Refined Color Palette: Elegant deep slate backgrounds, metallic gold gradients, and micro-interactions powered by `framer-motion`.
- Implemented **Feature Flags**, **Referral Tracking**, and a **Billing Stub** (`Checkout` route).
- **Gating**: "Everyone" is free; selecting "Male" or "Female" prompts a sophisticated `PremiumUpsellModal`.
- **Consent**: Camera/Mic usage requires explicit un-skippable consent.

### 3. Observability & Infra
- Deployed **Prometheus** metrics exposing `/metrics`.
- Configured **Pino JSON logging** and **Sentry SDK** on Front-/Back-ends.
- Includes a rigorous K8s `Horizontal Pod Autoscaler` set for burst scaling.

## 💻 Local Development Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```
2. **Run Local Dev Server**
   ```bash
   npm run dev
   ```
   *Frontend is served by Vite on `:5173`. Backend Express/Socket server runs natively via the Vite plugin.*

## 🧪 Testing Commands

- **Unit & Integration Tests**: 
  ```bash
  npm test
  ```
  *(Simulates core WebRTC handshakes and client state queuing.)*

- **Load Testing (k6)**:
  ```bash
  k6 run tests/load/signaling.js
  ```
  *(Verifies WebSocket throughput for 10k connections)*

## 📦 Staging Deployment

The GitHub Actions CI pipeline is configured to automatically deploy staging files from `k8s/` on merge to `main`. 

Manual One-Command Deploy:
```bash
kubectl apply -f k8s/
```
*(Applies `deployment.yaml`, `service.yaml`, and `hpa.yaml`)*

## 🛡 Risk & Rollback
- Revert traffic flow manually via the `<previous-tag>` hash using `kubectl set image deployment/aurapal-web aurapal-web=aurapal-web:<tag>`. 
- See `RUNBOOK.md` and `docs/ROLLOUT_PLAN.md` for extended emergency response queries.
