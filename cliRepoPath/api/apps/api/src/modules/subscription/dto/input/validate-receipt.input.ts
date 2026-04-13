import { InputType, Field } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class IosReceipt
 * @typedef {IosReceipt}
 */
@InputType()
export class IosReceipt {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  receipt: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AndroidReceipt
 * @typedef {AndroidReceipt}
 */
@InputType()
export class AndroidReceipt {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  packageName: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  subscriptionId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  token: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  signature: string;
}
