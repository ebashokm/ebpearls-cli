import { AuditLog, dataAccessModels } from '@app/data-access';
import { ModelDefinition } from '@nestjs/mongoose';
import { auditFieldsPlugin } from './audit-fields.plugin';
import { Schema } from 'mongoose';

export const auditFieldSchemas: ModelDefinition[] = dataAccessModels.filter(
  (x) => x.name != AuditLog.name,
);
attachAuditFields(auditFieldSchemas.map((x) => x.schema));

export function attachAuditFields(schemas: Schema[]) {
  schemas.forEach((schema) => {
    schema.plugin(auditFieldsPlugin);
  });
}
