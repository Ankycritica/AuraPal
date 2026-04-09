import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import sessionMiddleware from './auth/session.js';
import aiRoutes from './api/ai.js';
import stripeRoutes from './api/stripe.js';
import googleAuth from './auth/google.js';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const app = express();

app.use(cors({ origin: true, credentials: true }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests. Please try again later.' },
});

// AI-specific rate limiter (tighter)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'AI rate limit reached. Please wait a minute.' },
});

// Stripe webhook needs raw body — mount BEFORE express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(apiLimiter);
app.use(sessionMiddleware);

// API Routes
app.use('/api/auth/google', googleAuth);
app.use('/api/stripe', stripeRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);

// Auth status
app.get('/api/auth/me', (req, res) => {
  res.json({ user: req.user || { id: 'demo', name: 'Demo User', credits: 5, plan: 'free' } });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    logger.info({ event: 'server_start', port: PORT });
    console.log(`AuraPal API running on port ${PORT}`);
  });
}

export { app, httpServer };
