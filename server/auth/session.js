import session from 'express-session'

const sessionMiddleware = session({
  secret: process.env.SESSION_COOKIE_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
})

export default sessionMiddleware