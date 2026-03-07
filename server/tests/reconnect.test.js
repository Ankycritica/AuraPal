/**
 * AuraPal — Reconnection Grace-Window Integration Test
 *
 * Tests:
 *  1. Normal pairing
 *  2. Transient blip: disconnect + reconnect within grace → partner sees partner-reconnecting then partner-reconnected
 *  3. Permanent disconnect: no reconnect → partner sees video-end after grace
 *
 * Run: node server/tests/reconnect.test.js
 * Env: GRACE_WINDOW_MS=5000 node server/tests/reconnect.test.js  (short window for CI)
 */
import { createServer } from 'http'
import { Server } from 'socket.io'
import { io as ioClient } from 'socket.io-client'

// ─── Minimal in-process server mirroring server.js grace-window logic ─────────
const GRACE_MS = parseInt(process.env.GRACE_WINDOW_MS ?? '6000')

function buildTestServer() {
    const httpServer = createServer()
    const io = new Server(httpServer, { cors: { origin: '*' } })

    const videoWaiting = []
    const videoPeers = new Map() // socketId -> partnerId
    const sessionReg = new Map() // sessionId -> { socketId, partnerId, graceTimer, state }
    const sockToSess = new Map() // socketId -> sessionId

    io.on('connection', (socket) => {
        socket.on('identify', ({ sessionId }) => {
            if (!sessionId) return
            const existing = sessionReg.get(sessionId)
            if (!existing) {
                sessionReg.set(sessionId, { socketId: socket.id, state: 'active', graceTimer: null, pendingPartnerId: null })
            } else {
                existing.socketId = socket.id
            }
            sockToSess.set(socket.id, sessionId)
        })

        socket.on('video-find-random', () => {
            if (!videoWaiting.includes(socket.id)) videoWaiting.push(socket.id)
            tryPair()
        })

        socket.on('video-end', () => {
            const partnerId = videoPeers.get(socket.id)
            if (partnerId) {
                io.to(partnerId).emit('video-end')
                videoPeers.delete(socket.id)
                videoPeers.delete(partnerId)
            }
            const sessId = sockToSess.get(socket.id)
            if (sessId) { sessionReg.delete(sessId); sockToSess.delete(socket.id) }
        })

        socket.on('resume-session', ({ sessionId }) => {
            const sess = sessionReg.get(sessionId)
            if (!sess || sess.state !== 'pending_reconnect') {
                socket.emit('session-not-found'); return
            }
            if (sess.graceTimer) { clearTimeout(sess.graceTimer); sess.graceTimer = null }
            sess.socketId = socket.id
            sess.state = 'reconnected'
            sockToSess.set(socket.id, sessionId)
            const partnerId = sess.pendingPartnerId
            if (partnerId) {
                videoPeers.set(socket.id, partnerId)
                videoPeers.set(partnerId, socket.id)
                sess.pendingPartnerId = null
            }
            socket.emit('session-resumed', { partnerId })
            if (partnerId) io.to(partnerId).emit('partner-reconnected')
        })

        socket.on('video-offer', (d) => { const p = videoPeers.get(socket.id); if (p) io.to(p).emit('video-offer', d) })
        socket.on('video-answer', (d) => { const p = videoPeers.get(socket.id); if (p) io.to(p).emit('video-answer', d) })
        socket.on('ice-candidate', (d) => { const p = videoPeers.get(socket.id); if (p) io.to(p).emit('ice-candidate', d) })

        socket.on('disconnect', () => {
            const sessId = sockToSess.get(socket.id)
            const sess = sessId ? sessionReg.get(sessId) : null
            const partner = videoPeers.get(socket.id)

            if (partner && sess) {
                sess.state = 'pending_reconnect'
                sess.socketId = null
                sess.pendingPartnerId = partner
                sockToSess.delete(socket.id)
                videoPeers.delete(socket.id)
                io.to(partner).emit('partner-reconnecting', { graceWindowMs: GRACE_MS })
                sess.graceTimer = setTimeout(() => {
                    const s = sessionReg.get(sessId)
                    if (!s || s.state !== 'pending_reconnect') return
                    const pId = s.pendingPartnerId
                    if (pId) { io.to(pId).emit('video-end'); videoPeers.delete(pId) }
                    s.state = 'ended'; s.pendingPartnerId = null; sessionReg.delete(sessId)
                }, GRACE_MS)
            } else if (partner) {
                io.to(partner).emit('video-end')
                videoPeers.delete(socket.id)
                videoPeers.delete(partner)
            }
            videoWaiting.splice(videoWaiting.indexOf(socket.id), 1)
        })

        function tryPair() {
            while (videoWaiting.length >= 2) {
                const a = videoWaiting.shift(); const b = videoWaiting.shift()
                videoPeers.set(a, b); videoPeers.set(b, a)
                io.to(a).emit('video-ready', {}); io.to(b).emit('video-ready', {})
            }
        }
    })

    return new Promise(resolve => httpServer.listen(0, () => resolve({ io, httpServer, port: httpServer.address().port })))
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
let passed = 0; let failed = 0
function assert(ok, msg) {
    if (ok) { console.log(`  ✅ PASS: ${msg}`); passed++ }
    else { console.error(`  ❌ FAIL: ${msg}`); failed++ }
}
const wait = (ms) => new Promise(r => setTimeout(r, ms))
const event = (sock, name, timeoutMs = 8000) => new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout waiting for "${name}"`)), timeoutMs)
    sock.once(name, (data) => { clearTimeout(t); resolve(data) })
})

function makeClient(url, sessionId) {
    const c = ioClient(url, { transports: ['websocket'] })
    c.once('connect', () => c.emit('identify', { sessionId }))
    return c
}

// ─── Tests ────────────────────────────────────────────────────────────────────
async function runTests() {
    console.log(`\n=== AuraPal Reconnection Tests (GRACE_MS=${GRACE_MS}ms) ===\n`)
    const { httpServer, port } = await buildTestServer()
    const url = `http://localhost:${port}`

    // ─── TEST 1: Normal pairing ────────────────────────────────────────────────
    console.log('TEST 1: Normal pairing')
    {
        const sessA = 'sess-A1'; const sessB = 'sess-B1'
        const c1 = makeClient(url, sessA); const c2 = makeClient(url, sessB)
        await Promise.all([event(c1, 'connect'), event(c2, 'connect')])
        const [r1, r2] = await Promise.all([
            event(c1, 'video-ready'), event(c2, 'video-ready'),
            (async () => { await wait(80); c1.emit('video-find-random'); await wait(80); c2.emit('video-find-random') })()
        ])
        assert(r1 !== undefined, 'Client 1 received video-ready')
        assert(r2 !== undefined, 'Client 2 received video-ready')
        c1.disconnect(); c2.disconnect()
    }

    await wait(300)

    // ─── TEST 2: Transient blip — reconnect within grace ──────────────────────
    console.log('\nTEST 2: Transient blip — reconnect within grace window')
    {
        const sessA = `sess-A2-${Date.now()}`; const sessB = `sess-B2-${Date.now()}`
        const c1 = makeClient(url, sessA); const c2 = makeClient(url, sessB)
        await Promise.all([event(c1, 'connect'), event(c2, 'connect')])

        await Promise.all([
            event(c1, 'video-ready'), event(c2, 'video-ready'),
            (async () => { await wait(80); c1.emit('video-find-random'); await wait(80); c2.emit('video-find-random') })()
        ])

        // Step 1: C1 disconnects — C2 should get partner-reconnecting
        const reconnectingPromise = event(c2, 'partner-reconnecting', GRACE_MS + 2000)
        c1.disconnect()
        const reconnectingPayload = await reconnectingPromise
        assert(reconnectingPayload?.graceWindowMs === GRACE_MS, `C2 got partner-reconnecting with correct graceWindowMs (${reconnectingPayload?.graceWindowMs})`)

        // Step 2: C1 reconnects (within grace) — C2 should get partner-reconnected
        const c1b = makeClient(url, sessA)
        await event(c1b, 'connect')
        const reconnectedPromise = event(c2, 'partner-reconnected', GRACE_MS + 2000)
        c1b.emit('resume-session', { sessionId: sessA })
        const resumedEv = await event(c1b, 'session-resumed', 3000)
        const reconnected = await reconnectedPromise
        assert(resumedEv !== undefined, 'C1 received session-resumed')
        assert(reconnected !== undefined, 'C2 received partner-reconnected')

        c1b.disconnect(); c2.disconnect()
    }

    await wait(500)

    // ─── TEST 3: Permanent disconnect — video-end after grace ─────────────────
    console.log('\nTEST 3: No reconnect — video-end after grace window')
    {
        const sessA = `sess-A3-${Date.now()}`; const sessB = `sess-B3-${Date.now()}`
        const c1 = makeClient(url, sessA); const c2 = makeClient(url, sessB)
        await Promise.all([event(c1, 'connect'), event(c2, 'connect')])
        await Promise.all([
            event(c1, 'video-ready'), event(c2, 'video-ready'),
            (async () => { await wait(80); c1.emit('video-find-random'); await wait(80); c2.emit('video-find-random') })()
        ])

        c1.disconnect()
        // Wait for grace window + small buffer
        const endResult = await Promise.race([
            event(c2, 'video-end', GRACE_MS + 3000),
            wait(GRACE_MS + 3000).then(() => 'TIMEOUT')
        ])
        assert(endResult !== 'TIMEOUT', `C2 received video-end within ${GRACE_MS + 3000}ms after permanent disconnect`)
        c2.disconnect()
    }

    await wait(300)
    httpServer.close()

    console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
    process.exit(failed > 0 ? 1 : 0)
}

runTests().catch(err => { console.error(err); process.exit(1) })
