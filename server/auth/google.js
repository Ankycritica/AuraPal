import express from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/user.js'

const router = express.Router()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ 'providers.provider': 'google', 'providers.providerId': profile.id })
    if (!user) {
      user = new User({
        email: profile.emails[0].value,
        displayName: profile.displayName,
        avatarUrl: profile.photos[0].value,
        providers: [{ provider: 'google', providerId: profile.id }]
      })
      await user.save()
    }
    done(null, user)
  } catch (error) {
    done(error)
  }
}))

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Link guest identity if state contains guest token
  const guestToken = req.query.state
  if (guestToken) {
    // Link logic
  }
  res.redirect('/')
})

export default router