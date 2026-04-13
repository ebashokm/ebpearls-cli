import { ObjectType, Field } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class IdentityDocumentData
 * @typedef {IdentityDocumentData}
 */
@ObjectType()
export class IdentityDocumentData {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  front: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  back: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class BankDetailData
 * @typedef {BankDetailData}
 */
@ObjectType()
export class BankDetailData {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  accountName?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  routingNumber?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  accountNumber?: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class StripePaymentDetailData
 * @typedef {StripePaymentDetailData}
 */
@ObjectType()
export class StripePaymentDetailData {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  accountType: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  accountId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  linkStatus: string; // account_not_created, link_pending, link_completed

  /**
   * ${1:Description placeholder}
   *
   * @type {BankDetailData}
   */
  @Field(() => BankDetailData, { nullable: true })
  bankDetail: BankDetailData;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  status: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  connectLogs: string;
}

@ObjectType()
export class StripeCustomerReponseData {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  userId: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  customerId: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => IdentityDocumentData, { nullable: true })
  identityDocuments: IdentityDocumentData;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => StripePaymentDetailData, { nullable: true })
  paymentDetail: StripePaymentDetailData;
}
