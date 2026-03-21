/* eslint-env jest */
import { createServer } from 'http'
import { Server } from 'socket.io'
import Client from 'socket.io-client'
import { httpServer, io } from '../server.js'

describe('Video Chat Signaling', () => {
    let client1, client2, client3
    let port

    beforeAll((done) => {
        httpServer.listen(() => {
            port = httpServer.address().port
            done()
        })
    })

    afterAll((done) => {
        io.close()
        httpServer.close()
        done()
    })

    afterEach(() => {
        if (client1?.connected) client1.disconnect()
        if (client2?.connected) client2.disconnect()
        if (client3?.connected) client3.disconnect()
    })

    test('should match two non-premium users', (done) => {
        client1 = new Client(`http://localhost:${port}`)
        client2 = new Client(`http://localhost:${port}`)

        let readyCount = 0

        client1.on('video-ready', (data) => {
            expect(data.partner.guestName).toBe('User 2')
            readyCount++
            if (readyCount === 2) done()
        })

        client2.on('video-ready', (data) => {
            expect(data.partner.guestName).toBe('User 1')
            readyCount++
            if (readyCount === 2) done()
        })

        client1.emit('video-find-random', { guestName: 'User 1', genderPreference: 'everyone' })
        setTimeout(() => {
            client2.emit('video-find-random', { guestName: 'User 2', genderPreference: 'everyone' })
        }, 50)
    })

    test('premium users should match first', (done) => {
        client1 = new Client(`http://localhost:${port}`) // Non-premium
        client2 = new Client(`http://localhost:${port}`) // Non-premium
        client3 = new Client(`http://localhost:${port}`) // Premium

        let client3Matched = false

        client3.on('video-ready', (data) => {
            client3Matched = true
            expect(data.partner.guestName).toBe('User 2')
            done()
        })

        client1.emit('video-find-random', { guestName: 'User 1', isPremium: false })

        setTimeout(() => {
            client3.emit('video-find-random', { guestName: 'User 3', isPremium: true })

            setTimeout(() => {
                client2.emit('video-find-random', { guestName: 'User 2', isPremium: false })
            }, 50)
        }, 50)
    })

    test('should exchange WebRTC signaling properly', (done) => {
        client1 = new Client(`http://localhost:${port}`)
        client2 = new Client(`http://localhost:${port}`)

        client1.on('video-ready', () => {
            client1.emit('video-offer', { type: 'offer', sdp: 'dummy' })
        })

        client2.on('video-offer', (offer) => {
            expect(offer.type).toBe('offer')
            client2.emit('video-answer', { type: 'answer', sdp: 'dummy2' })
        })

        client1.on('video-answer', (answer) => {
            expect(answer.type).toBe('answer')
            client1.emit('ice-candidate', { candidate: 'ice1' })
        })

        client2.on('ice-candidate', (candidate) => {
            expect(candidate.candidate).toBe('ice1')
            client2.emit('video-end')
        })

        client1.on('video-end', () => {
            done()
        })

        client1.emit('video-find-random', { guestName: 'C1' })
        client2.emit('video-find-random', { guestName: 'C2' })
    })
})

