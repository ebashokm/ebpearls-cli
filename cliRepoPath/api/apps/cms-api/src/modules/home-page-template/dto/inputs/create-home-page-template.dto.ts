import { InputType, Field } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @class BannerInput
 * @typedef {BannerInput}
 */
@InputType()
class BannerInput {
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
 * @class HomeBannerInput
 * @typedef {HomeBannerInput}
 */
@InputType()
class HomeBannerInput {
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
 * @class FeaturedProductsMeta
 * @typedef {FeaturedProductsMeta}
 */
@InputType()
class FeaturedProductsMeta {
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
 * @class FeaturedProductInput
 * @typedef {FeaturedProductInput}
 */
@InputType()
class FeaturedProductInput {
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
   * @type {FeaturedProductsMeta[]}
   */
  @Field(() => [FeaturedProductsMeta])
  meta: FeaturedProductsMeta[];
}

/**
 * ${1:Description placeholder}
 *
 * @class ImageColumnMeta
 * @typedef {ImageColumnMeta}
 */
@InputType()
class ImageColumnMeta {
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
 * @class ImageColumnInput
 * @typedef {ImageColumnInput}
 */
@InputType()
class ImageColumnInput {
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
   * @type {ImageColumnMeta[]}
   */
  @Field(() => [ImageColumnMeta])
  meta: ImageColumnMeta[];
}

/**
 * ${1:Description placeholder}
 *
 * @class StepsMeta
 * @typedef {StepsMeta}
 */
@InputType()
class StepsMeta {
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
 * @class StepsInput
 * @typedef {StepsInput}
 */
@InputType()
class StepsInput {
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
   * @type {StepsMeta[]}
   */
  @Field(() => [StepsMeta])
  meta: StepsMeta[];
}

/**
 * ${1:Description placeholder}
 *
 * @class SEOInput
 * @typedef {SEOInput}
 */
@InputType()
class SEOInput {
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
 * @class FAQContent
 * @typedef {FAQContent}
 */
@InputType()
class FAQContent {
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
 * @class FAQInput
 * @typedef {FAQInput}
 */
@InputType()
class FAQInput {
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
   * @type {FAQContent[]}
   */
  @Field(() => [FAQContent])
  content: FAQContent[];
}

/**
 * ${1:Description placeholder}
 *
 * @class HeaderInput
 * @typedef {HeaderInput}
 */
@InputType()
class HeaderInput {
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
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateHomePageTemplateDto
 * @typedef {CreateHomePageTemplateDto}
 */
@InputType()
export class CreateHomePageTemplateDto {
  /**
   * ${1:Description placeholder}
   *
   * @type {HeaderInput[]}
   */
  @Field(() => [HeaderInput])
  header: HeaderInput[];

  /**
   * ${1:Description placeholder}
   *
   * @type {BannerInput[]}
   */
  @Field(() => [BannerInput], { nullable: true })
  banner: BannerInput[];

  /**
   * ${1:Description placeholder}
   *
   * @type {HomeBannerInput[]}
   */
  @Field(() => [HomeBannerInput], { nullable: true })
  homeBanner: HomeBannerInput[];

  /**
   * ${1:Description placeholder}
   *
   * @type {FeaturedProductInput[]}
   */
  @Field(() => [FeaturedProductInput], { nullable: true })
  featuredProduct: FeaturedProductInput[];

  /**
   * ${1:Description placeholder}
   *
   * @type {ImageColumnInput[]}
   */
  @Field(() => [ImageColumnInput], { nullable: true })
  imageColumn: ImageColumnInput[];

  /**
   * ${1:Description placeholder}
   *
   * @type {StepsInput[]}
   */
  @Field(() => [StepsInput], { nullable: true })
  steps: StepsInput[];

  /**
   * ${1:Description placeholder}
   *
   * @type {SEOInput[]}
   */
  @Field(() => [SEOInput], { nullable: true })
  seo: SEOInput[];

  /**
   * ${1:Description placeholder}
   *
   * @type {FAQInput[]}
   */
  @Field(() => [FAQInput], { nullable: true })
  faq: FAQInput[];
}
