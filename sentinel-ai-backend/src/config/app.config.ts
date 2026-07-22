import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  rateLimitAuthTtl: parseInt(process.env.RATE_LIMIT_AUTH_TTL, 10) || 60000,
  rateLimitAuthMax: parseInt(process.env.RATE_LIMIT_AUTH_MAX, 10) || 10,
  enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
  enableMfa: process.env.ENABLE_MFA !== 'false',
  enableGoogleOauth: process.env.ENABLE_GOOGLE_OAUTH === 'true',
  enableGithubOauth: process.env.ENABLE_GITHUB_OAUTH === 'true',
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT, 10) || 587,
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  smtpFrom: process.env.SMTP_FROM || 'Sentinel AI <noreply@sentinelai.io>',
}));
