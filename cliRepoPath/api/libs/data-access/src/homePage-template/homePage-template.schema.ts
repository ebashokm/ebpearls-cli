import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type HomePageTemplateDocument = HomePageTemplate & mongoose.Document;

class Banner {
  @Prop({ unique: true })
  id: string;
  @Prop()
  image: string;
  @Prop()
  alt: string;
  @Prop()
  description: string;
  @Prop()
  label: string;
  @Prop()
  url: string;
}

class HomeBanner {
  @Prop({ unique: true })
  id: string;
  @Prop()
  image: string;
  @Prop()
  alt: string;
  @Prop()
  heading: string;
  @Prop()
  label: string;
  @Prop()
  url: string;
}
class FeaturedProductsMeta {
  @Prop({ unique: true })
  id: string;
  @Prop()
  image: string;
  @Prop()
  name: string;
  @Prop()
  type: string;
}
class FeaturedProducts {
  @Prop({ unique: true })
  id: string;
  @Prop()
  text: string;
  @Prop(() => FeaturedProductsMeta)
  meta: [FeaturedProductsMeta];
}

class ImageColumnMeta {
  @Prop({ unique: true })
  id: string;
  @Prop()
  image: string;
  @Prop({ enum: ['left', 'right', 'center'] })
  align: string;
  @Prop()
  main: string;
  @Prop()
  sub: string;
}

class ImageColumn {
  @Prop({ unique: true })
  id: string;
  @Prop()
  text: string;
  @Prop(() => ImageColumnMeta)
  meta: [ImageColumnMeta];
}

class StepsMeta {
  @Prop({ unique: true })
  id: string;
  @Prop()
  image: string;
  @Prop()
  title: string;
  @Prop()
  description: string;
}

class Steps {
  @Prop({ unique: true })
  id: string;
  @Prop()
  text: string;
  @Prop(() => StepsMeta)
  meta: [StepsMeta];
}

class SEO {
  title: string;
  text: string;
  description: string;
}

class FAQContent {
  @Prop()
  _id: string;
  @Prop()
  question: string;
  @Prop()
  answer: string;
}

class FAQ {
  @Prop()
  section: string;
  @Prop()
  description: string;
  @Prop(() => FAQContent)
  content: [FAQContent];
}

@Schema({ timestamps: true })
export class HomePageTemplate {
  @Prop({ unique: true })
  title: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({ enum: ['active', 'inactive'] })
  status: string;

  @Prop()
  body: string;

  @Prop(() => Banner)
  banner: [Banner];

  @Prop(() => HomeBanner)
  homeBanner: [HomeBanner];

  @Prop(() => FeaturedProducts)
  featuredProduct: [FeaturedProducts];

  @Prop(() => ImageColumn)
  imageColumn: [ImageColumn];

  @Prop(() => Steps)
  steps: [Steps];

  @Prop(() => SEO)
  seo: SEO;

  @Prop(() => FAQ)
  faq: [FAQ];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const HomePageTemplateSchema = SchemaFactory.createForClass(HomePageTemplate);
