import { Field, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class IdentityDocument
 * @typedef {IdentityDocument}
 */
@ObjectType()
export class IdentityDocument {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  @Prop()
  front: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  @Prop()
  back: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class BankDetail
 * @typedef {BankDetail}
 */
@ObjectType()
export class BankDetail {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  @Prop()
  accountName?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  @Prop()
  routingNumber?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  @Prop()
  accountNumber?: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class StripePaymentDetail
 * @typedef {StripePaymentDetail}
 */
@ObjectType()
export class StripePaymentDetail {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  @Prop()
  accountType: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  @Prop()
  accountId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  @Prop()
  linkStatus: string; // account_not_created, link_pending, link_completed

  /**
   * ${1:Description placeholder}
   *
   * @type {BankDetail}
   */
  @Field({ nullable: true })
  @Prop()
  bankDetail: BankDetail;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  @Prop()
  status: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  @Prop()
  connectLogs: string;
}
