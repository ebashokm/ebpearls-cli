import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateEmailTemplateDTO
 * @typedef {CreateEmailTemplateDTO}
 */
@InputType()
export class CreateEmailTemplateDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsNotEmpty()
  @Field()
  title: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsNotEmpty()
  @Field()
  slug: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsNotEmpty()
  @Field()
  subject: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsNotEmpty()
  @Field()
  body: string;
}
