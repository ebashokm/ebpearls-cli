import { BaseResponse } from '@app/common/dto/response/base-response.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PhoneNumberResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  countryCode: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  isPhoneRegistered: boolean;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  phoneNumber: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  phoneNumberId: string;
}

@ObjectType()
export class ContactResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  _id: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  name: string;

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
  deviceId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  contactId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  isUserRegistered: boolean;
}

@ObjectType()
export class ContactDetailsResponse extends ContactResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  countryCode: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  isPhoneRegistered: boolean;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  phoneNumber: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  phoneNumberId: string;
}

@ObjectType()
export class ContactDetailResponse extends ContactResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => [PhoneNumberResponse], { nullable: true })
  phoneNumbers: PhoneNumberResponse[];
}

@ObjectType()
export class ContactsListResponse extends BaseResponse {
  @Field(() => [ContactDetailsResponse], { nullable: true })
  contacts?: ContactDetailsResponse[];
}
