import { ObjectType, Field } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @class BannerSchema
 * @typedef {BannerSchema}
 */
@ObjectType()
class BannerSchema {
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
  image: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  alt: string;
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
   * @type {string}
   */
  @Field()
  label: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  url: string;
}

/**
 * ${1:Description placeholder}
 *
 * @class HomeBannerSchema
 * @typedef {HomeBannerSchema}
 */
@ObjectType()
class HomeBannerSchema {
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
  image: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  alt: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  label: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  heading: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  url: string;
}

/**
 * ${1:Description placeholder}
 *
 * @class FeaturedProductsMetaSchema
 * @typedef {FeaturedProductsMetaSchema}
 */
@ObjectType()
class FeaturedProductsMetaSchema {
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
  image: string;
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
  type: string;
}

/**
 * ${1:Description placeholder}
 *
 * @class FeaturedProductsSchema
 * @typedef {FeaturedProductsSchema}
 */
@ObjectType()
class FeaturedProductsSchema {
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
  text: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {FeaturedProductsMetaSchema[]}
   */
  @Field(() => [FeaturedProductsMetaSchema])
  meta: FeaturedProductsMetaSchema[];
}

/**
 * ${1:Description placeholder}
 *
 * @class ImageColumnMetaSchema
 * @typedef {ImageColumnMetaSchema}
 */
@ObjectType()
class ImageColumnMetaSchema {
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
  image: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  align: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  main: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  sub: string;
}

/**
 * ${1:Description placeholder}
 *
 * @class ImageColumnSchema
 * @typedef {ImageColumnSchema}
 */
@ObjectType()
class ImageColumnSchema {
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
  text: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {ImageColumnMetaSchema[]}
   */
  @Field(() => [ImageColumnMetaSchema])
  meta: ImageColumnMetaSchema[];
}

/**
 * ${1:Description placeholder}
 *
 * @class StepsMetaSchema
 * @typedef {StepsMetaSchema}
 */
@ObjectType()
class StepsMetaSchema {
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
  image: string;
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
  description: string;
}

/**
 * ${1:Description placeholder}
 *
 * @class StepsSchema
 * @typedef {StepsSchema}
 */
@ObjectType()
class StepsSchema {
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
  text: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {StepsMetaSchema[]}
   */
  @Field(() => [StepsMetaSchema])
  meta: StepsMetaSchema[];
}

/**
 * ${1:Description placeholder}
 *
 * @class SEOSchema
 * @typedef {SEOSchema}
 */
@ObjectType()
class SEOSchema {
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
  text: string;
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
 * @class FAQContentSchema
 * @typedef {FAQContentSchema}
 */
@ObjectType()
class FAQContentSchema {
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
 * @class FAQSchema
 * @typedef {FAQSchema}
 */
@ObjectType()
class FAQSchema {
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
   * @type {FAQContentSchema[]}
   */
  @Field(() => [FAQContentSchema])
  content: FAQContentSchema[];
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class HomePageTemplate
 * @typedef {HomePageTemplate}
 */
@ObjectType()
export class HomePageTemplate {
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
   * @type {string}
   */
  @Field()
  body: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {BannerSchema[]}
   */
  @Field(() => [BannerSchema], { nullable: true })
  banner: BannerSchema[];

  /**
   * ${1:Description placeholder}
   *
   * @type {HomeBannerSchema[]}
   */
  @Field(() => [HomeBannerSchema], { nullable: true })
  homeBanner: HomeBannerSchema[];

  /**
   * ${1:Description placeholder}
   *
   * @type {FeaturedProductsSchema[]}
   */
  @Field(() => [FeaturedProductsSchema], { nullable: true })
  featuredProduct: FeaturedProductsSchema[];

  /**
   * ${1:Description placeholder}
   *
   * @type {ImageColumnSchema[]}
   */
  @Field(() => [ImageColumnSchema], { nullable: true })
  imageColumn: ImageColumnSchema[];

  /**
   * ${1:Description placeholder}
   *
   * @type {StepsSchema[]}
   */
  @Field(() => [StepsSchema], { nullable: true })
  steps: StepsSchema[];

  /**
   * ${1:Description placeholder}
   *
   * @type {SEOSchema[]}
   */
  @Field(() => [SEOSchema], { nullable: true })
  seo: SEOSchema[];

  /**
   * ${1:Description placeholder}
   *
   * @type {FAQSchema[]}
   */
  @Field(() => [FAQSchema], { nullable: true })
  faq: FAQSchema[];

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
