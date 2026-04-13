/**
 * ${1:Description placeholder}
 *
 * @export
 * @interface NotificationInput
 * @typedef {NotificationInput}
 */
export interface NotificationInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  theme: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  description: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?{
   *     [key: string]: any;
   *   }\}
   */
  themeAttributes?: {
    [key: string]: any;
  };
}
