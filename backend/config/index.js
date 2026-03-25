import dotenv from 'dotenv';
import path from 'path';

const envResult = dotenv.config({ path: path.resolve(process.cwd(), '.env') });
if (envResult.error) {
  console.warn('[config] .env not found, using environment variables if provided.');
} else {
  console.log('[config] .env loaded successfully');
}

console.log('[config] PORT env var:', process.env.PORT);

const required = [
  'PORT',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'DATABASE_URL',
  'REDIS_URL',
  'ADMIN_API_KEY'
];

for (const key of required) {
  if (!process.env[key]) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

export default {
  port: Number(process.env.PORT || 4000),
  env: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  jwtSecret: process.env.JWT_SECRET || 'changeit',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'changeit-refresh',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  cookieDomain: process.env.COOKIE_DOMAIN || 'localhost',
  dbUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 100),
  adminApiKey: process.env.ADMIN_API_KEY || 'changeme',
  recaptchaSecret: process.env.RECAPTCHA_SECRET || '',
  notificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || '',
  smtpHost: process.env.SMTP_HOST || 'smtp.ethereal.email',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || ''
};
