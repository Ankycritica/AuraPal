## Local Dev & Staging — Quick Start

### 1. Install & Run Locally
```bash
npm ci
npm run dev
# Frontend: http://localhost:5173
# Backend signal server: http://localhost:3000
```

### 2. Run Integration Tests
```bash
npm run test:integration
# or directly:
node server/tests/socket-pair.test.js
```
Expected output:
```
✅ PASS: Client 1 received video-ready
✅ PASS: Client 2 received video-ready
✅ PASS: Client 2 received video-end within 2s
✅ PASS: Client 2 received video-skipped within 2s
✅ PASS: Client 2 received video-end when Client 1 disconnected
=== Results: 5 passed, 0 failed ===
```

### 3. Docker Staging (one command)
```bash
docker compose up --build
```

---

## Troubleshooting Checklist

Open both **Browser Console** and **Server Terminal** to verify:

| Step | Browser Console (Client) | Server Terminal |
|------|--------------------------|-----------------|
| Connect | `Socket connected <id>` | `socket_connect socketId=...` |
| Search | `[Signal] Emitting video-find-random` | `[video-find-random] <id>` |
| Pair | `[Signal] video-ready received` (both clients) | `Paired: <a> <-> <b>` |
| Offer | `[Signal] Sending video-offer` (offerer) | `[video-offer] <a> -> <b>` |
| Answer | (answerer sends video-answer) | `[video-answer] <b> -> <a>` |
| ICE | `[WebRTC] Got remote track` | *(no log needed)* |
| Connected | Toast "Connected! 🎉" | *(both sides)* |
| End | `[Control] End` | `video-end from <id>, notifying <partner>` |
| Skip | `[Control] Skip` | `[video-skip] <id> -> partner <partner>` |

### Common Issues

**Both clients stuck on "Searching…"**
- Check server is running on port 3000: `curl http://localhost:3000/metrics`  
- Ensure `VITE_SOCKET_URL=http://localhost:3000` in `.env`

**Video stream visible locally but not remotely**
- Check WebRTC ICE candidates are flowing — look for `[WebRTC] Sending ICE candidate` in console
- Try adding a real TURN server: `TURN_URL=turn:your.turn.server:3478`

**`video-end` not received by partner**
- Confirm server logs show `sending video-end to video partner <id>`
- Check partner socket is still connected

**Camera blocked**
- In Chrome: click the lock icon → Allow camera & microphone → Reload
