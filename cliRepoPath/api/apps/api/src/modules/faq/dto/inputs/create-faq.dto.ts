import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNotEmpty, MaxLength, ValidateNested } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @class Content
 * @typedef {Content}
 */
@InputType()
class Content {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsNotEmpty()
  @Field()
  _id: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  @MaxLength(200)
  question: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  @MaxLength(200)
  answer: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateFAQDto
 * @typedef {CreateFAQDto}
 */
@InputType()
export class CreateFAQDto {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  section: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {[Content]}
   */
  @Field(() => [Content])
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Content)
  content: [Content];
}
