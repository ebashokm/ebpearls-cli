import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

/**
 * Security guard for cron operations to prevent unauthorized access
 */
@Injectable()
export class CronSecurityGuard implements CanActivate {
  private readonly logger = new Logger(CronSecurityGuard.name);

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Check if request is from localhost (internal cron)
    if (this.isLocalhost(request)) {
      return true;
    }

    // Check for cron secret key in headers
    const cronSecret = request.headers['x-cron-secret'] as string;
    const expectedSecret = this.configService.get<string>('CRON_SECRET_KEY');

    if (!cronSecret || !expectedSecret) {
      this.logger.warn(`[CRON-SECURITY] Missing cron secret - IP: ${request.ip}`);
      throw new UnauthorizedException('Cron secret required');
    }

    if (cronSecret !== expectedSecret) {
      this.logger.warn(`[CRON-SECURITY] Invalid cron secret - IP: ${request.ip}`);
      throw new UnauthorizedException('Invalid cron secret');
    }

    // Check for specific cron user agent
    const userAgent = request.get('User-Agent');
    if (!userAgent || !userAgent.includes('cron')) {
      this.logger.warn(
        `[CRON-SECURITY] Invalid user agent - IP: ${request.ip} - User-Agent: ${userAgent}`,
      );
      throw new UnauthorizedException('Invalid user agent for cron operations');
    }

    this.logger.log(`[CRON-SECURITY] Authorized cron operation - IP: ${request.ip}`);
    return true;
  }

  private isLocalhost(request: Request): boolean {
    const ip = request.ip;
    const forwarded = request.get('X-Forwarded-For');

    // Check if request is from localhost
    const localhostIPs = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

    return (
      localhostIPs.includes(ip) ||
      (forwarded && localhostIPs.includes(forwarded.split(',')[0].trim()))
    );
  }
}
