import {
  UserSchema,
  User,
  SubscriptionLog,
  SubscriptionLogSchema,
  Subscription,
  SubscriptionSchema,
} from '@app/data-access';
/**
 * ${1:Description placeholder}
 *
 * @type {{ name: any; schema: any; }[]\}
 */
export const mongooseModels = [
  { name: User.name, schema: UserSchema },
  { name: Subscription.name, schema: SubscriptionSchema },
  { name: SubscriptionLog.name, schema: SubscriptionLogSchema },
];
