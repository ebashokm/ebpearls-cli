import { registerEnumType } from '@nestjs/graphql';

export enum AuditLogActionEnum {
  ADD = 'add',
  UPDATE = 'update',
  DELETE = 'delete',
}

registerEnumType(AuditLogActionEnum, {
  name: 'AuditLogActionEnum',
});
