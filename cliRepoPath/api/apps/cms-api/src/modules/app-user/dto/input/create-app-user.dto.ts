import { Field, InputType } from '@nestjs/graphql';
import { Equals, IsEmail, IsNotEmpty, Length } from 'class-validator';
import { AuthProviderType } from '../entity/app-user.entity';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateAppUserDTO
 * @typedef {CreateAppUserDTO}
 */
@InputType()
export class CreateAppUserDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @Equals(AuthProviderType[AuthProviderType.email])
  authProvider: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  @IsEmail()
  authProviderId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Length(2, 80, { message: 'Invalid property length' })
  @IsNotEmpty()
  @Field()
  firstName: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Length(2, 80, { message: 'Invalid property length' })
  @IsNotEmpty()
  @Field()
  lastName: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  profileImage?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  address: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  bio: string;
}
