import { Field, InputType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AndroidReceiptConsumable
 * @typedef {AndroidReceiptConsumable}
 */
@InputType()
export class AndroidReceiptConsumable {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  purchaseToken: string;
}
