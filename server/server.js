import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import sessionMiddleware from './auth/session.js';

// Import our new routes
import aiRoutes from './api/ai.js';
import stripeRoutes from './api/stripe.js';
import googleAuth from './auth/google.js';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info', // Using pino for fast logging
});

const app = express();

// Enable CORS
app.use(cors({
  origin: true, // For dev
  credentials: true
}));

// Basic Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000,
  message: 'Too many requests, please try again later.'
});
app.use(apiLimiter);

// Stripe webhook needs raw body
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// Standard middleware
app.use(express.json());
app.use(sessionMiddleware);

// Routes
app.use('/api/auth/google', googleAuth);
app.use('/api/stripe', stripeRoutes);
app.use('/api/ai', aiRoutes);

// Auth Me route
app.get('/api/auth/me', (req, res) => {
  // Mock login for now if not using session locally
  res.json({ user: req.user || { id: 1, name: 'Demo User', credits: 5 } });
});

// Base 404 handler
app.use((req, res) => {
  res.status(404).send("Not Found");
});

const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    logger.info({ event: 'server_start', port: PORT });
    console.log(`Server running on port ${PORT}`);
  });
}

export { app, httpServer };
