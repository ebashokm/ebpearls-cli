import * as Joi from 'joi';

/**
 * ${1:Description placeholder}
 *
 * @type {*}
 */
export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  APP_ENV: Joi.string().valid('development', 'production', 'test', 'local').default('local'),
  DB_CONNECTION_STRING: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRES_IN: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRES_IN: Joi.string().required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_USER: Joi.string().required(),
  EMAIL_USER_PASS: Joi.string().required(),
  SALT_ROUNDS: Joi.number().default(10),
  POSITION_STACK_API: Joi.string().required(),
  BASE_URL: Joi.string().uri().required(),
  // CDN: Joi.string().uri().required(),
  CMS_PORTAL_URI: Joi.string().uri().required(),
  AWS_SES_ACCESS_KEY: Joi.string().required(),
  AWS_SES_SECRET_KEY: Joi.string().required(),
  AWS_SES_REGION: Joi.string().required(),
  AWS_SES_API_VERSION: Joi.string().required(),
  AWS_SES_FROM: Joi.string().email().required(),
  S3_ACCESS_KEY_ID: Joi.string().required(),
  S3_SECRET_ACCESS_KEY: Joi.string().required(),
  S3_BUCKET_NAME: Joi.string().required(),
  S3_REGION: Joi.string().required(),
  STRIPE_SECRET: Joi.string().required(),
  STRIPE_API_VERSION: Joi.string().required(),
  STRIPE_WEBHOOK_SECRET: Joi.string().required(),
  SMS_CODE_EXPIRE_BY: Joi.number().default(120000),
  SMS_CODE_EXPIRE_MULTIPLIER: Joi.number().default(4),
  '2FA_METHOD': Joi.string()
    .valid('authenticator-based-otp', 'sms-based-otp')
    .default('authenticator-based-otp'),
});
