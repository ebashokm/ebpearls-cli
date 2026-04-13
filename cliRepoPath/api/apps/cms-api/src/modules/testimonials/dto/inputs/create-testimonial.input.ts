import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @class FileType
 * @typedef {FileType}
 */
@InputType()
class FileType {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  name: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  objectKey: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  contentType: string;
}
/**
 * ${1:Description placeholder}
 *
 * @class Customer
 * @typedef {Customer}
 */
@InputType()
class Customer {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsNotEmpty()
  @IsString()
  @Field()
  comment: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {FileType}
   */
  @Field(() => FileType, { nullable: true })
  image: FileType;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsNotEmpty()
  @IsString()
  @Field()
  location: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateTestimonialDto
 * @typedef {CreateTestimonialDto}
 */
@InputType()
export class CreateTestimonialDto {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsNotEmpty()
  @IsString()
  @Field()
  text: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {Customer[]}
   */
  @IsNotEmpty()
  @Field(() => [Customer])
  customer: Customer[];
}
