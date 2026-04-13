import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SeoTag
 * @typedef {SeoTag}
 */
@ObjectType()
export class SeoTag {
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
  tags: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  description: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class Page
 * @typedef {Page}
 */
@ObjectType()
export class Page {
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
  status: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  content?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?SeoTag}
   */
  @Field(() => SeoTag, { nullable: true })
  seoTags?: SeoTag;

  /**
   * ${1:Description placeholder}
   *
   * @type {?Date}
   */
  @Field({ nullable: true })
  createdAt?: Date;

  /**
   * ${1:Description placeholder}
   *
   * @type {?Date}
   */
  @Field({ nullable: true })
  updatedAt?: Date;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PageResponse
 * @typedef {PageResponse}
 */
@ObjectType()
export class PageResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {Page}
   */
  @Field(() => Page, { nullable: true })
  page: Page;

  /**
   * ${1:Description placeholder}
   *
   * @type {[Page]}
   */
  @Field(() => [Page], { nullable: true })
  pages: [Page];
}
