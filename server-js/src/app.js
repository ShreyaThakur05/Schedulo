const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { env } = require('./config/env');
const apiRouter = require('./routes/index');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use('/api/v1/meetings', rateLimit({
  windowMs: 60_000, max: 20,
  message: { error: 'RATE_LIMITED', message: 'Too many requests.' }
}));

app.use('/api/v1', apiRouter);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use(errorHandler);

module.exports = app;
