require('dotenv').config();

const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: parseInt(process.env.PORT || '4000', 10),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  SEED_USER_ID: process.env.SEED_USER_ID || '00000000-0000-0000-0000-000000000001',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/api/v1/gcal/callback',
};

module.exports = { env };
