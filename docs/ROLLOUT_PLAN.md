# 30-Day Rollout Plan

## Phase 1: Internal Dogfooding (Days 1-7)
- Deploy to `staging` environment via GitHub Actions.
- Target: 100 internal concurrent sessions.
- **Metrics**: Verify Grafana dashboard picks up CPU/Memory sizing and Sentry logs any uncaught exceptions during stress.

## Phase 2: Canary Release (Days 8-14)
- Deploy to production cluster, routing 5% of global traffic.
- Enable `feature-flags`:
  - `upsell-variant`: `control` vs `aggressive` on 50/50 split.
  - `show-referrals`: `true`.
- **Validation**: Monitor the `aurapal_match_success_total` vs `aurapal_disconnect_total` rates closely in the Executive Dashboard.
- **Rollback Trigger**: Disconnect rate exceeds 12% sustained over 10 minutes.

## Phase 3: Premium Tier Beta (Days 15-21)
- Ramp up traffic routing to 25%.
- Turn on Stripe billing stub in production.
- Monitor active `Premium Profile Badge` uptake and measure conversion funnel in Mixpanel/Analytics.
- Adjust `videoWaiting` priority weight if free users experience > 45s wait times.

## Phase 4: General Availability (Days 22-30)
- Traffic routing to 100%.
- K8s Horizontal Pod Autoscaler (HPA) configured to scale between 10x-50x baseline based on memory and CPU limits.
- Announce launch.
