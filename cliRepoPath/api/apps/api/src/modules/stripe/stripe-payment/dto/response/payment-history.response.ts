import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaymentStatus } from '../../enum/payment-status.enum';
import { BasePaginationResponse } from '@app/common/dto/response/base-pagination.response';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PaymentHistoryResponse
 * @typedef {PaymentHistoryResponse}
 * @extends {BaseEntityResponse}
 */
@ObjectType()
export class PaymentHistoryResponse extends BaseEntityResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  username: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field({ nullable: true })
  amount: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {PaymentStatus}
   */
  @Field(() => PaymentStatus, { nullable: true })
  paymentStatus: PaymentStatus;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PaginatedPaymentHistoryResponse
 * @typedef {PaginatedPaymentHistoryResponse}
 */
@ObjectType()
export class PaginatedPaymentHistoryResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  message?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {PaymentHistoryResponse[]}
   */
  @Field(() => [PaymentHistoryResponse])
  data: PaymentHistoryResponse[];

  /**
   * ${1:Description placeholder}
   *
   * @type {BasePaginationResponse}
   */
  @Field(() => BasePaginationResponse)
  pagination: BasePaginationResponse;
}
