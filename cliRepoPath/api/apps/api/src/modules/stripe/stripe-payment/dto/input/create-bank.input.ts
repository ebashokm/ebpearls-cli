import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { AccountHolderType, AccountType } from '../../enum/payment-method.enum';
import { LinkConnectAccountType } from '../../enum/link-connect-account.enum';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateBankTokenInput
 * @typedef {CreateBankTokenInput}
 */
@InputType()
export class CreateBankTokenInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  @Length(3, 80)
  accountName: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({
    description: 'Test account numbers: https://stripe.com/docs/connect/testing#account-numbers',
  })
  @IsNotEmpty()
  @Length(6, 16) // 6 for australian account
  accountNumber: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({
    description: 'BSB number in australian account case:- 000000, 110000',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  routingNumber: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?AccountHolderType}
   */
  @Field(() => AccountHolderType, { nullable: true })
  accountHolderType?: AccountHolderType;

  /**
   * ${1:Description placeholder}
   *
   * @type {?AccountType}
   */
  @Field(() => AccountType, { nullable: true }) // optional, not supported in many cases
  accountType?: AccountType;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateBankDetailInput
 * @typedef {CreateBankDetailInput}
 * @extends {CreateBankTokenInput}
 */
@InputType()
export class CreateBankDetailInput extends CreateBankTokenInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  @IsOptional()
  // @IsAllowedExt({ message: 'File extension not supported' }, [
  //   'jpeg',
  //   'jpg',
  //   'png',
  // ])
  identityDocumentFront: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  @IsOptional()
  // @IsAllowedExt({ message: 'File extension not supported' }, [
  //   'jpeg',
  //   'jpg',
  //   'png',
  // ])
  identityDocumentBack: string;
}

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
   * @type {LinkConnectAccountType}
   */
  @Field(() => LinkConnectAccountType)
  @IsNotEmpty()
  connectAccountType: LinkConnectAccountType;
}
