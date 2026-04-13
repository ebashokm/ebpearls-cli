import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuditLogActionEnum } from './audit-log-action.enum';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema()
export class AuditLog {
  @Prop({
    type: String,
    required: true,
    maxlength: 100,
  })
  tableName: string;

  @Prop({
    type: String,
    required: true,
    maxlength: 100,
  })
  recordId: string;

  @Prop({
    type: String,
    required: true,
    enum: AuditLogActionEnum,
  })
  action: AuditLogActionEnum;

  @Prop({
    type: String,
    required: true,
    maxlength: 100,
  })
  changedBy: string;

  @Prop({
    type: Date,
    required: true,
    default: Date.now,
  })
  changedAt: Date;

  @Prop({
    type: String,
    default: null,
  })
  oldValues?: string;

  @Prop({
    type: String,
    default: null,
  })
  newValues?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

AuditLogSchema.index({ tableName: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ changedAt: 1 });
AuditLogSchema.index({ changedBy: 1 });
AuditLogSchema.index({ oldValues: 1 });
AuditLogSchema.index({ newValues: 1 });

AuditLogSchema.index({
  tableName: 1,
  action: 1,
  changedBy: 1,
  changedAt: 1,
  oldValues: 1,
  newValues: 1,
});
// ...add other index if requird
