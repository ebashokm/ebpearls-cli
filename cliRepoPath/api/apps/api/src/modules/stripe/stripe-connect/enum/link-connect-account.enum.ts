import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum LinkBankAccountType {
  EXPRESS = 'express',
  STANDARD = 'standard',
  CUSTOM = 'custom',
}

registerEnumType(LinkBankAccountType, {
  name: 'LinkBankAccountType',
});
