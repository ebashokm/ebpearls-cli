import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

/**
 * Enhanced Logger Module with security-focused logging
 */
@Module({
  imports: [
    WinstonModule.forRoot({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
          let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;

          // Add metadata if present
          if (Object.keys(meta).length > 0) {
            logMessage += ` ${JSON.stringify(meta)}`;
          }

          // Add stack trace for errors
          if (stack) {
            logMessage += `\n${stack}`;
          }

          return logMessage;
        }),
      ),
      transports: [
        // Console transport with colors
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.printf(({ level, message, timestamp }) => {
              return `${timestamp} [${level}]: ${message}`;
            }),
          ),
        }),

        // General application logs
        new winston.transports.DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d', // Keep logs for 30 days
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),

        // Security-specific logs
        new winston.transports.DailyRotateFile({
          filename: 'logs/security-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '10m',
          maxFiles: '90d', // Keep security logs for 90 days
          level: 'warn',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),

        // Error logs
        new winston.transports.DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '10m',
          maxFiles: '30d',
          level: 'error',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),

        // Audit logs for sensitive operations
        new winston.transports.DailyRotateFile({
          filename: 'logs/audit-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '10m',
          maxFiles: '365d', // Keep audit logs for 1 year
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
      ],

      // Exception handling
      exceptionHandlers: [
        new winston.transports.DailyRotateFile({
          filename: 'logs/exceptions-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '10m',
          maxFiles: '30d',
        }),
      ],

      // Rejection handling
      rejectionHandlers: [
        new winston.transports.DailyRotateFile({
          filename: 'logs/rejections-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '10m',
          maxFiles: '30d',
        }),
      ],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
