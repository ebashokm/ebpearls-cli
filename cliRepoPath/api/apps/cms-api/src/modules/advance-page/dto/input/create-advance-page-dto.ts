import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @enum {number}
 */
enum AdvancePageType {
  HELP = 'help',
  PRIVACY_POLICY = 'privacy policy',
  TERMS = 'terms and conditions',
}

/**
 * ${1:Description placeholder}
 *
 * @enum {number}
 */
enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/**
 * ${1:Description placeholder}
 *
 * @class TestimonialsInput
 * @typedef {TestimonialsInput}
 */
@InputType()
class TestimonialsInput {
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
   * @type {string[]}
   */
  @Field(() => [String], { nullable: true })
  selectedTestimonials: string[];
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
 * @class FaqInput
 * @typedef {FaqInput}
 */
@InputType()
class FaqInput {
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
 * @class SeoTagInput
 * @typedef {SeoTagInput}
 */
@InputType()
class SeoTagInput {
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
 * @class BannerButtonInput
 * @typedef {BannerButtonInput}
 */
@InputType()
class BannerButtonInput {
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
 * @class BannerInputPage
 * @typedef {BannerInputPage}
 */
@InputType()
class BannerInputPage {
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
   * @type {BannerButtonInput}
   */
  @Field({ nullable: true })
  button: BannerButtonInput;
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
 * @class ImageColumnSectionInput
 * @typedef {ImageColumnSectionInput}
 */
@InputType()
class ImageColumnSectionInput {
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
   * @type {?string}
   */
  @Field({ nullable: true })
  image?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  alignment: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  iconHeading: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  subHeading: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  subText: string;
}

/**
 * ${1:Description placeholder}
 *
 * @class ImageColumnInputPage
 * @typedef {ImageColumnInputPage}
 */
@InputType()
class ImageColumnInputPage {
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
  columnType: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {ImageColumnSectionInput[]}
   */
  @Field(() => [ImageColumnSectionInput])
  sections: ImageColumnSectionInput[];
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
 * @class HowItWorksSectionInput
 * @typedef {HowItWorksSectionInput}
 */
@InputType()
class HowItWorksSectionInput {
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
 * @class SelectedProductsInput
 * @typedef {SelectedProductsInput}
 */
@InputType()
class SelectedProductsInput {
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
 * @class HowItWorksInputPage
 * @typedef {HowItWorksInputPage}
 */
@InputType()
class HowItWorksInputPage {
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
   * @type {HowItWorksSectionInput[]}
   */
  @Field(() => [HowItWorksSectionInput])
  sections: HowItWorksSectionInput[];
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
 * @class FeaturedProductsInputPage
 * @typedef {FeaturedProductsInputPage}
 */
@InputType()
class FeaturedProductsInputPage {
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
  productType: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {SelectedProductsInput[]}
   */
  @Field(() => [SelectedProductsInput])
  sections: SelectedProductsInput[];
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

@InputType()
export class CreateAdvancePageDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @Field()
  title: string;

  // @IsString()
  // @Field({ nullable: true })
  // createdBy: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @Field()
  slug: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsEnum(Status)
  @Field()
  status: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  content?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {BannerInputPage[]}
   */
  @Field(() => [BannerInputPage], { nullable: true })
  banner: BannerInputPage[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?BannerInputPage[]}
   */
  @IsArray()
  @Field(() => [BannerInputPage], { nullable: true })
  homePage?: BannerInputPage[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?ImageColumnInputPage[]}
   */
  @IsArray()
  @Field(() => [ImageColumnInputPage], { nullable: true })
  imageColumn?: ImageColumnInputPage[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?HowItWorksInputPage[]}
   */
  @IsArray()
  @Field(() => [HowItWorksInputPage], { nullable: true })
  howItWorks?: HowItWorksInputPage[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?FeaturedProductsInputPage[]}
   */
  @IsArray()
  @Field(() => [FeaturedProductsInputPage], { nullable: true })
  featuredProducts?: FeaturedProductsInputPage[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?SeoTagInput}
   */
  @Field(() => SeoTagInput, { nullable: true })
  seoTags?: SeoTagInput;

  /**
   * ${1:Description placeholder}
   *
   * @type {?FaqInput}
   */
  @Field(() => FaqInput, { nullable: true })
  faq?: FaqInput;

  /**
   * ${1:Description placeholder}
   *
   * @type {?TestimonialsInput}
   */
  @Field(() => TestimonialsInput, { nullable: true })
  testimonials?: TestimonialsInput;
}
