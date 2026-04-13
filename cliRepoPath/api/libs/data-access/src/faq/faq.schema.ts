import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type FAQDocument = FAQ & mongoose.Document;

class Content {
  @Prop({ required: true, unique: true })
  _id: string;
  @Prop({ required: true })
  question: string;
  @Prop({ required: true })
  answer: string;
}

@Schema({ timestamps: true })
export class FAQ {
  @Prop({ required: true })
  section: string;
  @Prop({ required: true })
  description: string;
  @Prop({ type: () => [Content], required: true })
  content: [Content];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const FaqSchema = SchemaFactory.createForClass(FAQ);
