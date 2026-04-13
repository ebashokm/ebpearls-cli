import * as Joi from 'joi';

/**
 * Enhanced configuration validation schema with security requirements
 */
export const configValidationSchema = Joi.object({
  // Application Configuration
  PORT: Joi.number().default(3000),
  APP_ENV: Joi.string().valid('development', 'production', 'test', 'local').default('development'),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  // Database Configuration
  DB_CONNECTION_STRING: Joi.string().required(),

  // JWT Configuration with enhanced validation
  JWT_ACCESS_TOKEN_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_TOKEN_EXPIRE_IN: Joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_TOKEN_EXPIRE_IN: Joi.string().required(),
  JWT_BIOMETRIC_TOKEN_SECRET: Joi.string().min(32).required(),
  JWT_BIOMETRIC_TOKEN_EXPIRE_IN: Joi.string().required(),

  // Social Authentication
  FACEBOOK_APP_SECRET: Joi.string().min(16).required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  APPLE_CLIENT_ID: Joi.string().required(),
  ANDROID_SCHEME: Joi.string().required(),

  // AWS Configuration
  S3_BUCKET_NAME: Joi.string().required(),
  S3_REGION: Joi.string().required(),
  AWS_SES_ACCESS_KEY: Joi.string().required(),
  AWS_SES_SECRET_KEY: Joi.string().required(),
  AWS_SES_REGION: Joi.string().required(),
  AWS_SES_API_VERSION: Joi.string().required(),
  AWS_SES_FROM: Joi.string().email().required(),

  // Stripe Configuration
  STRIPE_SECRET: Joi.string().required(),
  STRIPE_API_VERSION: Joi.string().required(),
  STRIPE_WEBHOOK_SECRET: Joi.string().min(32).required(),
  STRIPE_CONNECT_WEBHOOK_SECRET: Joi.string().min(32).required(),

  // In-App Purchase Configuration
  ANDROID_IAP_CLIENT_EMAIL: Joi.string().email().required(),
  ANDROID_IAP_PRIVATE_KEY: Joi.string().required(),
  IN_APP_IOS_SECRET: Joi.string().required(),
  IAP_MODE: Joi.string().required(),

  // OTP Configuration
  OTP_AWS_SNS_ACCESS_KEY: Joi.string().required(),
  OTP_AWS_SNS_SECRET_KEY: Joi.string().required(),
  OTP_AWS_SNS_REGION: Joi.string().required(),
  OTP_AWS_SNS_API_VERSION: Joi.string().required(),
  OTP_TWILIO_ACCOUNT_SID: Joi.string().required(),
  OTP_TWILIO_AUTH_TOKEN: Joi.string().required(),
  OTP_TWILIO_PHONE_NUMBER: Joi.string().required(),

  // TikTok Configuration
  TIKTOK_CLIENT_KEY: Joi.string().required(),
  TIKTOK_CLIENT_SECRET: Joi.string().required(),

  // Firebase Configuration
  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_PRIVATE_KEY: Joi.string().required(),
  FIREBASE_CLIENT_EMAIL: Joi.string().email().required(),

  // CometChat Configuration
  COMET_CHAT_APP_ID: Joi.string().required(),
  COMET_CHAT_SECRET_KEY: Joi.string().required(),
  COMET_CHAT_API_URL: Joi.string().uri().required(),

  // Agora Configuration
  AGORA_APP_ID: Joi.string().required(),
  AGORA_APP_CERTIFICATE: Joi.string().required(),
  AGORA_CHAT_HOST: Joi.string().required(),
  AGORA_CHAT_ORG_NAME: Joi.string().required(),
  AGORA_CHAT_APP_NAME: Joi.string().required(),

  // Redis Configuration
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().port().required(),
  REDIS_PASSWORD: Joi.string().required(),

  // Security Configuration
  // CRON_SECRET_KEY: Joi.string().min(32).required(),
  BULL_BOARD_PATH: Joi.string().default('/admin/queues'),
  BULL_BOARD_USER: Joi.string().default('admin'),
  BULL_BOARD_PASSWORD: Joi.string().min(8).required(),

  // File Upload Configuration
  MULTER_UPLOAD_DEST: Joi.string().default('./uploads'),

  // Logging Configuration
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),

  // Rate Limiting Configuration
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),

  // Session Configuration
  SESSION_MAX_AGE: Joi.number().default(86400000), // 24 hours

  // CORS Configuration
  CORS_ORIGINS: Joi.string().default(
    'http://localhost:3001,https://dev-et-web.draftserver.com,https://stage-et-web.draftserver.com',
  ),

  // API Keys and Secrets
  RAPID_ID_ACCESS_TOKEN: Joi.string().required(),
  RAPID_ID_ENVIRONMENT: Joi.string().valid('sandbox', 'production').required(),

  // Subscription Configuration
  SUBSCRIPTION_KEY_IDENTIFIER: Joi.string().required(),
  SUBSCRIPTION_PRIVATE_KEY: Joi.string().required(),

  // Stripe Currency
  STRIPE_CURRENCY: Joi.string().default('aud'),

  // Sentry
  SENTRY_DSN: Joi.string().required(),

  //Agora Cloud Recording
  CLOUD_RECORDING_HOST_NAME: Joi.string().required(),
  CLOUD_RECORDING_TOKEN: Joi.string().required(),
  CLOUD_RECORDING_SECRET: Joi.string().required(),

  //SQS Configuration
  SQS_AWS_ACCESS_KEY_ID: Joi.string().required(),
  SQS_AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  SQS_AWS_REGION: Joi.string().required(),
  SQS_QUEUE_URL: Joi.string().uri().required(),
  ENABLE_SQS: Joi.string().valid('true', 'false').default('false'),
});
