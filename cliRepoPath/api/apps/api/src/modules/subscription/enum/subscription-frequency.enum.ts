import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum SubscriptionFrequency {
  PRO = 'pro',
  PREMIUM = 'premium',
}
registerEnumType(SubscriptionFrequency, { name: 'SubscriptionFrequency' });
