import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum AdminStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  DISABLED = 'disabled',
}

registerEnumType(AdminStatus, {
  name: 'AdminStatus',
});
