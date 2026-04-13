import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';

export type AdminBlockDocument = AdminBlock & mongoose.Document;

@Schema({ timestamps: true })
export class AdminBlock {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  color: string;

  @Prop({ default: false })
  reducesUtilisation: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'Business',
  })
  businessId: string;
}

export const AdminBlockSchema = SchemaFactory.createForClass(AdminBlock);

// Compound index for business-specific queries with sorting by isActive and name
AdminBlockSchema.index({ businessId: 1, isActive: -1, name: 1 });

// Index for text search on name and description
AdminBlockSchema.index({ name: 'text', description: 'text' });
