const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { env } = require('./config/env');
const apiRouter = require('./routes/index');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

const allowedOrigin = env.FRONTEND_URL.trim().replace(/\/$/, '');

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Normalize: strip trailing slash, ensure https:// prefix for comparison
    const normalized = origin.trim().replace(/\/$/, '');
    if (normalized === allowedOrigin || normalized === allowedOrigin.replace('https://', 'http://')) {
      return callback(null, true);
    }
    // Also allow localhost for local dev
    if (normalized.startsWith('http://localhost')) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

app.use('/api/v1/meetings', rateLimit({
  windowMs: 60_000, max: 20,
  message: { error: 'RATE_LIMITED', message: 'Too many requests.' }
}));

app.use('/api/v1', apiRouter);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use(errorHandler);

module.exports = app;
