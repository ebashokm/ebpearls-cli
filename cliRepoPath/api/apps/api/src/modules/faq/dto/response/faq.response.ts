import { BaseResponse } from '@app/common/dto/response/base-response.dto';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @class ContentType
 * @typedef {ContentType}
 */
@ObjectType()
class ContentType {
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
  question: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  answer: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FAQ
 * @typedef {FAQ}
 */
@ObjectType()
export class FAQ {
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
  section: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  description: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {ContentType[]}
   */
  @Field(() => [ContentType])
  content: ContentType[];
  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field(() => Date, { nullable: true })
  createdAt: Date;
  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FAQResponse
 * @typedef {FAQResponse}
 * @extends {BaseResponse}
 */
@ObjectType()
export class FAQResponse extends BaseResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {?FAQ}
   */
  @Field(() => FAQ, { nullable: true })
  faq?: FAQ;

  /**
   * ${1:Description placeholder}
   *
   * @type {?[FAQ]}
   */
  @Field(() => [FAQ])
  faqs?: [FAQ];
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FAQsResponse
 * @typedef {FAQsResponse}
 * @extends {MessageResponse}
 */
@ObjectType()
export class FAQsResponse extends MessageResponse {
  @Field(() => [FAQ])
  faqs?: [FAQ];

  @Field(() => Number)
  total?: number;
}
