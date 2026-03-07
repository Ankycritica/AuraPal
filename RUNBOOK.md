# AuraPal Runbook

This document details incident response procedures for the AuraPal Video Chat service.

## 🚨 Alerts & Trigger Conditions

### High Disconnect Rate
**Trigger**: Disconnect rate > 10%
**Check**: View `aurapal_disconnect_total` rate in Prometheus.
**Steps**:
1. Check Sentry for spikes in `socket.io` or Node.js crashes.
2. Ensure ICE server (STUN/TURN) availability.
3. Validate client-side errors via Sentry.

### High Match Wait Time
**Trigger**: 95th percentile wait time > 30s
**Steps**:
1. Verify `aurapal_video_queue_length`. If large, check backend CPU.
2. Look for memory leaks blocking the Event Loop affecting WebSocket throughput.
3. Scale replicas in Kubernetes (`kubectl scale deployment aurapal-web --replicas=5`).

## 🔙 Rollback Procedure
If a recent deployment triggers immediate metric degradation:
1. Identify the previous stable image tag.
2. Revert deployment in k8s: `kubectl set image deployment/aurapal-web aurapal-web=aurapal-web:<previous-tag>`
3. Monitor `/metrics` until recovered.

## 📊 Useful Metric Queries
- Wait Queue Time: `histogram_quantile(0.95, sum(rate(aurapal_video_wait_time_seconds_bucket[5m])) by (le))`
- Active Queued Users: `sum(aurapal_video_queue_length)`
- Disconnection Rate: `rate(aurapal_disconnect_total[5m])`
