import { ObjectType, Field } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @class FileImageResponse
 * @typedef {FileImageResponse}
 */
@ObjectType()
class FileImageResponse {
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
  objectKey: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  contentType: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  url: string;
}
/**
 * ${1:Description placeholder}
 *
 * @class CustomerSchema
 * @typedef {CustomerSchema}
 */
@ObjectType()
class CustomerSchema {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  id: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  comment: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {FileImageResponse}
   */
  @Field(() => FileImageResponse, { nullable: true })
  image: FileImageResponse;

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
  location: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class Testimonial
 * @typedef {Testimonial}
 */
@ObjectType()
export class Testimonial {
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
  text: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {CustomerSchema[]}
   */
  @Field(() => [CustomerSchema])
  customer: CustomerSchema[];

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field(() => Date)
  createdAt: Date;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field(() => Date)
  updatedAt: Date;
}
