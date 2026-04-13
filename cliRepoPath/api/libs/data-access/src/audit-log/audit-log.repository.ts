import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from '../repository/base.repo';
import { AuditLog, AuditLogDocument } from './audit-log.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditLogRepository extends BaseRepo<AuditLogDocument> {
  constructor(@InjectModel(AuditLog.name) private readonly auditLog: Model<AuditLogDocument>) {
    super(auditLog);
  }
}
