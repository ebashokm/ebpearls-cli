import { Field, InputType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class IosReceiptConsumable
 * @typedef {IosReceiptConsumable}
 */
@InputType()
export class IosReceiptConsumable {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  receipt: string;
}
