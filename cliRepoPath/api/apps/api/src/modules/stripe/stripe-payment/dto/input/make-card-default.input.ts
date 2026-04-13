import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class MakeCardDefaultInput
 * @typedef {MakePaymentMethodDefaultInput}
 */
@InputType()
export class MakePaymentMethodDefaultInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  paymentMethodId: string;
}
