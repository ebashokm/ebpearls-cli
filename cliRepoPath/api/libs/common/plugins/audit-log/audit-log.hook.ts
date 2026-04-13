import { auditLogPlugin } from './audit-log.plugin';
import { AuditLog, dataAccessModels } from '@app/data-access';
import { ModelDefinition } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

export const auditLogSchemas: ModelDefinition[] = dataAccessModels.filter(
  (x) => x.name != AuditLog.name,
);
attachAuditLog(auditLogSchemas.map((x) => x.schema));

export function attachAuditLog(schemas: Schema[]) {
  schemas.forEach((schema) => {
    schema.plugin(auditLogPlugin);
  });
}
