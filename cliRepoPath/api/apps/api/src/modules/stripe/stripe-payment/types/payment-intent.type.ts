/**
 * ${1:Description placeholder}
 *
 * @export
 * @interface IPaymentIntentData
 * @typedef {IPaymentIntentData}
 */
export interface IPaymentIntentData {
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  amount: number;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  customer: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  paymentMethod: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  currency?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string[]}
   */
  paymentMethodType?: string[];
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  description?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?{
   *     [key: string]: string;
   *   }\}
   */
  metadata?: {
    [key: string]: string;
  };
}
