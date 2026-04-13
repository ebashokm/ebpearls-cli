import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum AdvancePageStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

registerEnumType(AdvancePageStatus, {
  name: 'AdvancePageStatus',
});
