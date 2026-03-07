# AuraPal Security & Compliance

## Threat Model Overview

The AuraPal application utilizes real-time WebRTC logic via Node.js WebSockets and Next.js/Vite React frontend.

1. **Denial of Service (DoS) against Signaling Server**:
   - **Threat**: Attackers open thousands of socket connections, depleting server memory.
   - **Mitigation**: `express-rate-limit` + Socket payload validation. K8s HPA ensures auto-scaling during unexpected load spikes.
   - **Status**: Implemented.

2. **WebRTC IP Leakage**:
   - **Threat**: Without explicit TURN, WebRTC ICE candidates leak raw IP addresses between clients.
   - **Mitigation**: Staged TURN servers mask direct connections when requested.

3. **Inappropriate Content & Harassment**:
   - **Threat**: Disinhibited peer-to-peer behavior.
   - **Mitigation**: E2E reporting loop implemented. Monetization loop requires credit card validation, raising the cost of banning.

## Data Retention Policy
- **Video Streams**: P2P only. We do not proxy, store, or record video/audio streams.
- **Socket Logs**: Retained in structured JSON format via Pino for 30 days for incident analysis, then purged. Includes Session ID, IP hash, and event names. Do not log PII.
- **User Activity Metrics**: Anonymized metrics kept indefinitely in Prometheus.
