/**
 * ${1:Description placeholder}
 *
 * @export
 * @interface IAndroidSubscriptionWebhook
 * @typedef {IAndroidSubscriptionWebhook}
 */
export interface IAndroidSubscriptionWebhook {
  /**
   * ${1:Description placeholder}
   *
   * @type {*}
   */
  message: any;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  notification_type?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  subscription?: string;
}
/**
 * ${1:Description placeholder}
 *
 * @export
 * @interface IosSubscriptionWebhookInterface
 * @typedef {IosSubscriptionWebhookInterface}
 */
export interface IosSubscriptionWebhookInterface {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  signedPayload: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  notification_type: string;
}
