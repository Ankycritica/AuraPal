/**
 * AuraPal — Socket Pairing Integration Test
 * Tests: video-find-random → video-ready → video-end propagation
 *
 * Run: node server/tests/socket-pair.test.js
 */
import { createServer } from 'http'
import { Server } from 'socket.io'
import { io as ioClient } from 'socket.io-client'

// ─── Minimal in-process signaling server ──────────────────────────────────────
function buildTestServer() {
    const httpServer = createServer()
    const io = new Server(httpServer, { cors: { origin: '*' } })

    const videoWaiting = []
    const videoPeers = new Map()

    io.on('connection', (socket) => {
        socket.on('video-find-random', (data) => {
            console.log(`[server] video-find-random from ${socket.id}`)
            if (!videoWaiting.includes(socket.id)) videoWaiting.push(socket.id)
            tryPair()
        })

        socket.on('video-skip', () => {
            const partner = videoPeers.get(socket.id)
            if (partner) {
                io.to(partner).emit('video-skipped')
                videoPeers.delete(socket.id)
                videoPeers.delete(partner)
                videoWaiting.push(partner)
            }
            videoWaiting.push(socket.id)
            tryPair()
        })

        socket.on('video-end', () => {
            const partner = videoPeers.get(socket.id)
            if (partner) {
                console.log(`[server] video-end from ${socket.id}, notifying ${partner}`)
                io.to(partner).emit('video-end')
                videoPeers.delete(socket.id)
                videoPeers.delete(partner)
            }
        })

        socket.on('video-offer', (d) => { const p = videoPeers.get(socket.id); if (p) io.to(p).emit('video-offer', d) })
        socket.on('video-answer', (d) => { const p = videoPeers.get(socket.id); if (p) io.to(p).emit('video-answer', d) })
        socket.on('ice-candidate', (d) => { const p = videoPeers.get(socket.id); if (p) io.to(p).emit('ice-candidate', d) })

        socket.on('disconnect', () => {
            const partner = videoPeers.get(socket.id)
            if (partner) { io.to(partner).emit('video-end'); videoPeers.delete(partner) }
            videoPeers.delete(socket.id)
        })

        function tryPair() {
            while (videoWaiting.length >= 2) {
                const a = videoWaiting.shift()
                const b = videoWaiting.shift()
                videoPeers.set(a, b)
                videoPeers.set(b, a)
                console.log(`[server] Paired: ${a} <-> ${b}`)
                io.to(a).emit('video-ready', {})
                io.to(b).emit('video-ready', {})
            }
        }
    })

    return new Promise((resolve) => {
        httpServer.listen(0, () => {
            const { port } = httpServer.address()
            resolve({ io, httpServer, port })
        })
    })
}

// ─── Test helpers ─────────────────────────────────────────────────────────────
let passed = 0; let failed = 0
function assert(condition, message) {
    if (condition) { console.log(`  ✅ PASS: ${message}`); passed++ }
    else { console.error(`  ❌ FAIL: ${message}`); failed++ }
}
function wait(ms) { return new Promise(r => setTimeout(r, ms)) }
function event(socket, name) {
    return new Promise((resolve) => socket.once(name, resolve))
}

// ─── Tests ────────────────────────────────────────────────────────────────────
async function runTests() {
    console.log('\n=== AuraPal Socket Pairing Integration Tests ===\n')
    const { httpServer, port } = await buildTestServer()
    const url = `http://localhost:${port}`

    // ─── TEST 1: Two clients pair ───────────────────────────────────────────────
    console.log('TEST 1: Two clients emit video-find-random and both receive video-ready')
    {
        const c1 = ioClient(url, { transports: ['websocket'] })
        const c2 = ioClient(url, { transports: ['websocket'] })

        await Promise.all([event(c1, 'connect'), event(c2, 'connect')])

        const [r1, r2] = await Promise.all([
            event(c1, 'video-ready'),
            event(c2, 'video-ready'),
            (async () => {
                await wait(50)
                c1.emit('video-find-random', { isPremium: false })
                await wait(50)
                c2.emit('video-find-random', { isPremium: false })
            })()
        ])

        assert(r1 !== undefined, 'Client 1 received video-ready')
        assert(r2 !== undefined, 'Client 2 received video-ready')

        // ─── TEST 2: video-end propagates to partner ─────────────────────────────
        console.log('\nTEST 2: Client 1 emits video-end; Client 2 receives video-end')
        const endPromise = event(c2, 'video-end')
        c1.emit('video-end')
        const endResult = await Promise.race([endPromise, wait(2000).then(() => 'TIMEOUT')])
        assert(endResult !== 'TIMEOUT', 'Client 2 received video-end within 2s')

        c1.disconnect(); c2.disconnect()
    }

    await wait(200)

    // ─── TEST 3: Skip notifies partner with video-skipped ──────────────────────
    console.log('\nTEST 3: Client 1 skips; Client 2 receives video-skipped')
    {
        const c1 = ioClient(url, { transports: ['websocket'] })
        const c2 = ioClient(url, { transports: ['websocket'] })
        await Promise.all([event(c1, 'connect'), event(c2, 'connect')])

        await Promise.all([
            event(c1, 'video-ready'),
            event(c2, 'video-ready'),
            (async () => {
                await wait(50); c1.emit('video-find-random', {})
                await wait(50); c2.emit('video-find-random', {})
            })()
        ])

        const skippedPromise = event(c2, 'video-skipped')
        c1.emit('video-skip')
        const skippedResult = await Promise.race([skippedPromise, wait(2000).then(() => 'TIMEOUT')])
        assert(skippedResult !== 'TIMEOUT', 'Client 2 received video-skipped within 2s')

        c1.disconnect(); c2.disconnect()
    }

    await wait(200)

    // ─── TEST 4: Disconnect notifies partner ────────────────────────────────────
    console.log('\nTEST 4: Client 1 disconnects; Client 2 receives video-end')
    {
        const c1 = ioClient(url, { transports: ['websocket'] })
        const c2 = ioClient(url, { transports: ['websocket'] })
        await Promise.all([event(c1, 'connect'), event(c2, 'connect')])

        await Promise.all([
            event(c1, 'video-ready'),
            event(c2, 'video-ready'),
            (async () => {
                await wait(50); c1.emit('video-find-random', {})
                await wait(50); c2.emit('video-find-random', {})
            })()
        ])

        const endOnDisconnect = event(c2, 'video-end')
        c1.disconnect()
        const res = await Promise.race([endOnDisconnect, wait(2000).then(() => 'TIMEOUT')])
        assert(res !== 'TIMEOUT', 'Client 2 received video-end when Client 1 disconnected')
        c2.disconnect()
    }

    await wait(200)
    httpServer.close()

    console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
    process.exit(failed > 0 ? 1 : 0)
}

runTests().catch((err) => { console.error(err); process.exit(1) })
