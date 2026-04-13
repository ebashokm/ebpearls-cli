import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum PurchasePlatform {
  IOS = 'ios',
  ANDROID = 'android',
}

registerEnumType(PurchasePlatform, {
  name: 'PurchasePlatform',
});
