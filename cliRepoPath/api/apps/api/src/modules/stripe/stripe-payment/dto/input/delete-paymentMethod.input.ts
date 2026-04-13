import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class DeleteCardInput
 * @typedef {DeletePaymentMethodInput}
 */
@InputType()
export class DeletePaymentMethodInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  paymentMethodId: string;
}
