import { MessageResponse } from '@app/common/dto/response/message.response';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateConnectAccountResponse
 * @typedef {CreateConnectAccountResponse}
 * @extends {MessageResponse}
 */
@ObjectType()
export class CreateConnectAccountResponse extends MessageResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  connectAccountId: string;
}

@ObjectType()
export class ExternalAccount {
  @Field()
  id: string;

  @Field()
  object: string;

  @Field()
  account: string; // account_not_created, pending, link_completed

  @Field({ nullable: true })
  account_holder_name: string;

  @Field({ nullable: true })
  account_holder_type: string;

  @Field({ nullable: true })
  bank_name: string;

  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  currency: string;

  @Field({ nullable: true })
  last4: string;

  @Field({ nullable: true })
  routing_number: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  default_for_currency: boolean;
}

@ObjectType()
export class StripeConnectAccountReponse {
  @Field()
  accountId: string;

  @Field()
  accountType: string;

  @Field()
  accountStatus: string; // account_not_created, pending, link_completed

  // @Field()
  // sourceId?: string;

  @Field()
  verificationStatus?: string;

  @Field()
  businessType: string;

  @Field(() => [ExternalAccount], { nullable: true })
  externalAccounts?: ExternalAccount[];
}

@ObjectType()
export class CreateCompanyBankAccountLinkResponse {
  @Field()
  url: string;

  @Field()
  created: number;

  @Field()
  expiresAt: number;
}
