import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AdvancePageStatus } from './advance-page-status.enum';

export type AdvancePageDocument = AdvancePage & Document;

@Schema({})
class Banner {
  @Prop({ required: false })
  image: string;
  @Prop({ required: false })
  altText: string;
  @Prop({ required: false })
  content: string;
  @Prop({ required: false })
  slug: string;
  @Prop({
    type: {
      heading: { type: String },
      destinationUrl: { type: String },
    },
  })
  button: { heading: string; destinationUrl: string };
  @Prop({ required: false })
  uuid: string;
}

@Schema({})
class ImageColumn {
  @Prop({ required: false })
  heading: string;
  @Prop({
    type: [
      {
        id: { type: String },
        image: { type: String },
        alignment: { type: String },
        iconHeading: { type: String },
        subText: { type: String },
      },
    ],
  })
  sections: {
    id: string;
    image: string;
    alignment: string;
    iconHeading: string;
    subText: string;
  }[];
  @Prop({ required: false })
  uuid: string;
}

@Schema({})
class HowItWorks {
  @Prop({ required: false })
  heading: string;
  @Prop({
    type: [
      {
        id: { type: String },
        image: { type: String },
        title: { type: String },
        description: { type: String },
      },
    ],
  })
  sections: {
    id: string;
    image: string;
    title: string;
    description: string;
  }[];
  @Prop({ required: false })
  uuid: string;
}

@Schema({})
class FeaturedProducts {
  @Prop({ required: false })
  heading: string;
  @Prop({
    type: [
      {
        id: { type: String },
        image: { type: String },
        name: { type: String },
        productType: { type: String },
      },
    ],
  })
  sections: {
    id: string;
    image: string;
    name: string;
    productType: string;
  }[];
  @Prop({ required: false })
  uuid: string;
}

class SeoTag {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  tags: string;
  @Prop({ required: true })
  description: string;
}

class Testimonial {
  @Prop({ required: true })
  heading: string;
  @Prop({ required: true })
  showTestimonials: boolean;
  @Prop({ required: false })
  uuid: string;
  @Prop({ type: () => [String] })
  selectedTestimonials: string[];
  @Prop({ default: false })
  disabled: boolean;
}

class FAQ {
  @Prop({ required: true })
  showFaqs: boolean;
  @Prop({ type: () => [String], required: false })
  selectedFaqs: string[];
  @Prop({ required: false })
  uuid: string;
  @Prop({ default: false })
  disabled: boolean;
}

@Schema({ timestamps: true })
export class AdvancePage {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    required: true,
    default: AdvancePageStatus.INACTIVE,
    enum: [AdvancePageStatus.ACTIVE, AdvancePageStatus.INACTIVE],
  })
  status: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: () => [Banner] })
  banner: [Banner];

  @Prop({ type: () => [Banner] })
  homePage: [Banner];

  @Prop({ type: () => [ImageColumn] })
  imageColumn: [ImageColumn];

  @Prop({ type: () => [HowItWorks] })
  howItWorks: [HowItWorks];

  @Prop({ type: () => [FeaturedProducts] })
  featuredProducts: [FeaturedProducts];

  @Prop({ type: () => SeoTag })
  seoTags: SeoTag;

  @Prop({ type: () => FAQ })
  faq: FAQ;

  @Prop({ type: () => Testimonial })
  testimonials: Testimonial;

  @Prop({ nullable: true })
  createdBy: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const AdvancePageSchema = SchemaFactory.createForClass(AdvancePage);

AdvancePageSchema.index({ pageType: 'text' });
