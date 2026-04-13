import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@app/common/dto/response/base-response.dto';

@ObjectType()
export class EmailTemplate {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  _id: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  title: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  slug: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  subject: string;
  // @Field()
  // status: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  body: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  createdAt: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  updatedAt: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class EmailTemplateResponse
 * @typedef {EmailTemplateResponse}
 * @extends {BaseResponse}
 */
@ObjectType()
export class EmailTemplateResponse extends BaseResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {?EmailTemplate[]}
   */
  @Field(() => [EmailTemplate])
  emailTemplates?: EmailTemplate[];
  /**
   * ${1:Description placeholder}
   *
   * @type {?EmailTemplate}
   */
  @Field(() => EmailTemplate, { nullable: true })
  emailTemplate?: EmailTemplate;
}
