import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEmail, IsMongoId, IsNotEmpty, Length } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateAdminDTO
 * @typedef {CreateAdminDTO}
 */
@InputType()
export class CreateAdminDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @Length(2, 80, { message: 'Invalid property length' })
  firstName: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @Length(2, 80, { message: 'Invalid property length' })
  lastName: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => [String], { nullable: true })
  @IsMongoId({ each: true })
  @IsArray()
  roles: string[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  phone?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  profileImage?: string;
}
