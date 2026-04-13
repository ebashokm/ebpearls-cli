import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PageStatusWithVersion, PageTypeWithVersion } from './pageWithVersion.enum';
import { SeoTag } from '../page/page.schema';

@Schema({ timestamps: true })
export class PageWithVersion {
  @Prop({ required: true, type: String, unique: false })
  title: string;

  @Prop({ type: () => SeoTag })
  seoTags: SeoTag;

  @Prop({ required: true, type: String })
  pageType: PageTypeWithVersion;

  @Prop({ required: true, unique: false })
  slug: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  version: string;

  @Prop({ type: String, default: PageStatusWithVersion.ACTIVE })
  status: PageStatusWithVersion;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export type PageWithVersionDocument = mongoose.Document & PageWithVersion;
export const PageWithVersionSchema = SchemaFactory.createForClass(PageWithVersion);
