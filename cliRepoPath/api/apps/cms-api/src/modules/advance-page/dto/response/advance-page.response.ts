import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@app/common/dto/response/base-response.dto';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { AdvancePageStatus } from '@app/data-access/advance-page/advance-page-status.enum';

/**
 * ${1:Description placeholder}
 *
 * @class BannerButton
 * @typedef {BannerButton}
 */
@ObjectType()
class BannerButton {
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
  destinationUrl: string;
}

/**
 * ${1:Description placeholder}
 *
 * @class Banner
 * @typedef {Banner}
 */
@ObjectType()
class Banner {
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
  altText: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  content: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  slug: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {BannerButton}
   */
  @Field({ nullable: true })
  button: BannerButton;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  uuid: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field()
  index: number;
}

/**
 * ${1:Description placeholder}
 *
 * @class ImageColumnSection
 * @typedef {ImageColumnSection}
 */
@ObjectType()
class ImageColumnSection {
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
  alignment: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  iconHeading: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  subText: string;
}

/**
 * ${1:Description placeholder}
 *
 * @class ImageColumnPage
 * @typedef {ImageColumnPage}
 */
@ObjectType()
class ImageColumnPage {
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
   * @type {ImageColumnSection[]}
   */
  @Field(() => [ImageColumnSection])
  sections: ImageColumnSection[];
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  uuid: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field()
  index: number;
}

/**
 * ${1:Description placeholder}
 *
 * @class HowItWorksSection
 * @typedef {HowItWorksSection}
 */
@ObjectType()
class HowItWorksSection {
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
 * @class HowItWorksPage
 * @typedef {HowItWorksPage}
 */
@ObjectType()
class HowItWorksPage {
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
   * @type {HowItWorksSection[]}
   */
  @Field(() => [HowItWorksSection])
  sections: HowItWorksSection[];
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  uuid: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field()
  index: number;
}

/**
 * ${1:Description placeholder}
 *
 * @class FeaturedProductsSections
 * @typedef {FeaturedProductsSections}
 */
@ObjectType()
class FeaturedProductsSections {
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
  productType: string;
}

/**
 * ${1:Description placeholder}
 *
 * @class FeaturedProductsPage
 * @typedef {FeaturedProductsPage}
 */
@ObjectType()
class FeaturedProductsPage {
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
   * @type {FeaturedProductsSections[]}
   */
  @Field(() => [FeaturedProductsSections])
  sections: FeaturedProductsSections[];
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  uuid: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field()
  index: number;
}

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
 * @class Faq
 * @typedef {Faq}
 */
@ObjectType()
class Faq {
  /**
   * ${1:Description placeholder}
   *
   * @type {boolean}
   */
  @Field()
  showFaqs: boolean;
  /**
   * ${1:Description placeholder}
   *
   * @type {string[]}
   */
  @Field(() => [String], { nullable: true })
  selectedFaqs: string[];
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  uuid: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field()
  index: number;
  /**
   * ${1:Description placeholder}
   *
   * @type {boolean}
   */
  @Field({ nullable: true })
  disabled: boolean;
}

/**
 * ${1:Description placeholder}
 *
 * @class Testimonials
 * @typedef {Testimonials}
 */
@ObjectType()
class Testimonials {
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
   * @type {boolean}
   */
  @Field()
  showTestimonials: boolean;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  uuid: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field()
  index: number;
  /**
   * ${1:Description placeholder}
   *
   * @type {boolean}
   */
  @Field({ nullable: true })
  disabled: boolean;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string[]}
   */
  @Field(() => [String], { nullable: true })
  selectedTestimonials?: string[];
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class Page
 * @typedef {Page}
 */
@ObjectType()
export class AdvancePage {
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
   * @type {PageStatus}
   */
  @Field(() => AdvancePageStatus)
  status: AdvancePageStatus;
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
   * @type {?string}
   */
  @Field({ nullable: true })
  createdBy?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {Banner[]}
   */
  @Field(() => [Banner], { nullable: true })
  banner: Banner[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?Banner[]}
   */
  @Field(() => [Banner], { nullable: true })
  homePage?: Banner[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?ImageColumnPage[]}
   */
  @Field(() => [ImageColumnPage], { nullable: true })
  imageColumn?: ImageColumnPage[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?HowItWorksPage[]}
   */
  @Field(() => [HowItWorksPage], { nullable: true })
  howItWorks?: HowItWorksPage[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?FeaturedProductsPage[]}
   */
  @Field(() => [FeaturedProductsPage], { nullable: true })
  featuredProducts?: FeaturedProductsPage[];

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
   * @type {?Faq}
   */
  @Field(() => Faq, { nullable: true })
  faq?: Faq;

  /**
   * ${1:Description placeholder}
   *
   * @type {?Testimonials}
   */
  @Field(() => Testimonials, { nullable: true })
  testimonials?: Testimonials;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field({ nullable: true })
  createdAt?: Date;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
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
 * @extends {BaseResponse}
 */
@ObjectType()
export class AdvancePageResponse extends BaseResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {Page}
   */
  @Field(() => AdvancePage, { nullable: true })
  page: AdvancePage;

  @Field(() => [AdvancePage], { nullable: true })
  pages: [AdvancePage];
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AllPagesResponse
 * @typedef {AllPagesResponse}
 * @extends {MessageResponse}
 */
@ObjectType()
export class AllAdvancePagesResponse extends MessageResponse {
  @Field(() => [AdvancePage], { nullable: true })
  pages: [AdvancePage];
}
