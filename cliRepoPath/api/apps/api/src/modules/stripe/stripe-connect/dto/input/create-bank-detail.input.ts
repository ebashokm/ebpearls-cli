import { BusinessType } from '@api/modules/stripe/stripe-payment/enum/payment-status.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { LinkBankAccountType } from '../../enum/link-connect-account.enum';
import { AccountHolderType } from '../../enum/payment-method.enum';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateConnectAccountInput
 * @typedef {CreateConnectAccountInput}
 */
@InputType()
export class CreateConnectAccountInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  connectToken: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  @IsOptional()
  acn: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateBankAccountInput
 * @typedef {CreateBankAccountInput}
 */
@InputType()
export class CreateBankAccountInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  bankToken: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateBankAccountLinkInput
 * @typedef {CreateBankAccountLinkInput}
 */
@InputType()
export class CreateBankAccountLinkInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {LinkBankAccountType}
   */
  @Field(() => LinkBankAccountType, { defaultValue: LinkBankAccountType.STANDARD })
  bankAccountType: LinkBankAccountType;

  @Field(() => AccountHolderType, { defaultValue: AccountHolderType.INDIVIDUAL })
  accountHolderType: AccountHolderType;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  connectAccountId?: string;
}

@InputType()
export class CreateOnboardingAccountLinkInput {
  @Field()
  @IsEnum(BusinessType)
  businessType: BusinessType;
}
