import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogResolver } from './audit-log.resolver';
import { AuditLog, AuditLogRepository, AuditLogSchema } from '@app/data-access';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: AuditLog.name, schema: AuditLogSchema }])],
  providers: [AuditLogResolver, AuditLogService, AuditLogRepository],
})
export class AuditLogModule {}
