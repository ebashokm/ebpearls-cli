import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClusterService } from './cluster.service';
import helmet from 'helmet';
import { TrimPipe } from '@app/common/pipe/trim.pipe';

// import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';

/**
 * Enhanced CMS API bootstrap with comprehensive security measures
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

  // Enhanced CORS configuration for CMS
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5000',
        'http://localhost:3001',
        'http://localhost:3000',
        'https://dev-et-web.draftserver.com', //required for SSE
        'https://stage-et-web.draftserver.com', //required for SSE
        'https://dev-et-cms-api.draftserver.com',
        'https://stage-et-cms-api.draftserver.com',
        'https://dev-et-cms.draftserver.com',
        'https://stage-et-cms.draftserver.com',
        'https://studio.apollographql.com',
        'https://apollo-server-landing-page.cdn.apollographql.com',
      ];

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('Unauthorized origin >>>', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'csrf-token', 'x-requested-with'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    maxAge: 86400,
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

  // Stricter rate limiting for CMS API
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 50, // More restrictive for CMS
  //     message: 'Too many requests from this IP, please try again later.',
  //     standardHeaders: true,
  //     legacyHeaders: false,
  //     skip: (req) => {
  //       return req.path === '/health' || req.path === '/cms-api/health';
  //     }
  //   })
  // );

  // // Enhanced rate limiting for CMS auth endpoints
  // app.use('/cms-api/auth/*',
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 3, // Very restrictive for CMS auth
  //     message: 'Too many CMS authentication attempts, please try again later.',
  //     standardHeaders: true,
  //     legacyHeaders: false,
  //   })
  // );

  // Enhanced validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false, // More strict for CMS
      //whitelist: true,
      //forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: false, // More strict
      },
    }),
  );
  app.useGlobalPipes(new TrimPipe());

  // Security middleware for CMS-specific headers
  app.use((req, res, next) => {
    res.removeHeader('X-Powered-By');

    // Enhanced security headers for CMS
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    }

    // Log all CMS requests for security monitoring
    console.log(
      `[CMS-SECURITY] ${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`,
    );

    next();
  });

  const port = process.env.PORT || 3001;
  console.log(`🚀 CMS API Server running on port ${port}`);
  console.log(`🔒 Enhanced security features enabled for CMS`);

  await app.listen(port);
}
ClusterService.clusterize(bootstrap);
