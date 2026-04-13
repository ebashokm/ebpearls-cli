import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Min } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreatePaymentInput
 * @typedef {CreatePaymentInput}
 */
@InputType()
export class CreatePaymentInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  paymentMethodId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field()
  @Min(1)
  amount: number;
}
