import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum LinkConnectAccountType {
  EXPRESS = 'express',
  STANDARD = 'standard',
}

registerEnumType(LinkConnectAccountType, {
  name: 'LinkConnectAccountType',
});
