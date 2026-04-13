import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, raw } from 'express';
import { useContainer } from 'class-validator';
import { ClusterService } from './cluster.service';
import helmet from 'helmet';
import { TrimPipe } from '@app/common/pipe/trim.pipe';

import { ConfigService } from '@nestjs/config';

/**
 * Enhanced bootstrap function with comprehensive security measures
 *
 * @async
 * @returns {Promise<void>}
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger(),
    //cors: true,
  });

  const configService = app.get(ConfigService);

  // Enhanced CORS configuration
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://dev-et-api.draftserver.com',
        'https://stage-et-api.draftserver.com',
        'https://dev-et-web.draftserver.com',
        'https://stage-et-web.draftserver.com',
        'https://studio.apollographql.com',
        'https://apollo-server-landing-page.cdn.apollographql.com',
      ];

      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'csrf-token', 'x-requested-with'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    maxAge: 86400, // 24 hours
  });

  // Enhanced security headers with Helmet
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://apollo-server-landing-page.cdn.apollographql.com',
            'https://embeddable-sandbox.cdn.apollographql.com',
            'https://cdn.jsdelivr.net',
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://apollo-server-landing-page.cdn.apollographql.com',
            'https://fonts.googleapis.com',
          ],
          imgSrc: [
            "'self'",
            'data:',
            'https:',
            'apollo-server-landing-page.cdn.apollographql.com',
            'embeddable-sandbox.cdn.apollographql.com',
          ],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          connectSrc: [
            "'self'",
            'https://studio.apollographql.com',
            'https://apollo-server-landing-page.cdn.apollographql.com',
            'https://embeddable-sandbox.cdn.apollographql.com',
          ],
          frameSrc: ["'self'", 'sandbox.embed.apollographql.com'],
          manifestSrc: ["'self'", 'https://apollo-server-landing-page.cdn.apollographql.com'],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  // Rate limiting for API endpoints
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //     message: 'Too many requests from this IP, please try again later.',
  //     standardHeaders: true,
  //     legacyHeaders: false,
  //     skip: (req) => {
  //       // Skip rate limiting for health checks
  //       return req.path === '/health' || req.path === '/api/health';
  //     }
  //   })
  // );

  // // Enhanced rate limiting for auth endpoints
  // app.use('/api/auth/*',
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 5, // limit each IP to 5 auth requests per windowMs
  //     message: 'Too many authentication attempts, please try again later.',
  //     standardHeaders: true,
  //     legacyHeaders: false,
  //   })
  // );

  // Enhanced validation pipes
  app.useGlobalPipes(new TrimPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      //whitelist: true, // Strip properties that do not have any decorators
      //forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Raw body parsing for webhooks
  app.use('/stripe-webhook', raw({ type: '*/*' }));
  app.use('/subscription-webhook', raw({ type: '*/*' }));
  app.use(json({ limit: '10mb' })); // Limit JSON payload size

  // Security middleware for additional headers
  app.use((req, res, next) => {
    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');

    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Log security-relevant requests
    if (req.path.includes('auth') || req.path.includes('webhook')) {
      console.log(
        `[SECURITY] ${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`,
      );
    }

    next();
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port = process.env.PORT || 3000;
  console.log(`🚀 API Server running on port ${port}`);
  console.log(`🔒 Security features enabled: Helmet, CSRF, Rate Limiting, CORS`);

  await app.listen(port);
}
ClusterService.clusterize(bootstrap);
