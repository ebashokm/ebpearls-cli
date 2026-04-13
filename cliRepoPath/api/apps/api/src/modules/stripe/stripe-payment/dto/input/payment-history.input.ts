import { BasePaginationParams } from '@api/common/dto/base-pagination.dto';
import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { PaymentStatus } from '../../enum/payment-status.enum';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PaymentHistoryInput
 * @typedef {PaymentHistoryInput}
 * @extends {BasePaginationParams}
 */
@InputType()
export class PaymentHistoryInput extends BasePaginationParams {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true, defaultValue: 'desc' })
  @IsString()
  order?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?PaymentStatus}
   */
  @Field(() => PaymentStatus, {
    nullable: true,
  })
  status?: PaymentStatus;
}
