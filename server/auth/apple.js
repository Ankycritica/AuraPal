import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const router = express.Router()

if (process.env.APPLE_CLIENT_ID) {
  router.get('/', (req, res) => {
    // Apple OAuth initiation
    res.redirect('https://appleid.apple.com/auth/authorize?client_id=' + process.env.APPLE_CLIENT_ID + '&redirect_uri=' + encodeURIComponent('https://aurapal.vercel.app/api/auth/apple/callback') + '&response_type=code&scope=name%20email&response_mode=form_post')
  })

  router.post('/callback', async (req, res) => {
    // Verify Apple JWT
    // Similar to Google
    res.redirect('/chat')
  })
} else {
  router.get('/', (req, res) => res.status(500).json({ error: 'Apple OAuth not configured' }))
  router.post('/callback', (req, res) => res.status(500).json({ error: 'Apple OAuth not configured' }))
}

export default router