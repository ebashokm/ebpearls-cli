import mongoose, { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SeoTag } from '../page';
import { SurveyJsPageStatus } from './surveyjs-page.enum';

@Schema({ timestamps: true })
export class SurveyJsPage {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ type: () => SeoTag })
  seoTags: SeoTag;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  content: string;

  @Prop()
  version: string;

  @Prop({ nullable: true })
  surveyJson: string;

  @Prop({ type: Object })
  elements: Record<string, any>;

  @Prop({ type: String, default: SurveyJsPageStatus.ACTIVE })
  status: SurveyJsPageStatus;

  @Prop({ type: Date, nullable: true })
  publishedAt?: Date;

  @Prop({ type: Boolean, default: false })
  isDuplicated: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null, nullable: true })
  deletedAt: Date;
}

export type SurveyJsPageDocument = mongoose.Document & SurveyJsPage;

export const SurveyJsPageSchema = SchemaFactory.createForClass(SurveyJsPage);

export const surveyJsPageModel = {
  name: SurveyJsPage.name,
  schema: SurveyJsPageSchema,
};

SurveyJsPageSchema.set('timestamps', true);
