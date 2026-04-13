import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';

enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class EmailBuilder {
  @Prop()
  name: string;

  @Prop()
  jsonContent: string;

  @Prop()
  htmlContent: string;

  @Prop({
    required: false,
    ref: 'Business',
    index: true,
  })
  businessId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  communicationId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  deletedAt: Date;

  @Prop({ default: false })
  default: boolean;

  @Prop({
    required: false,
    enum: [Status.ACTIVE, Status.INACTIVE],
    default: Status.ACTIVE,
  })
  status: string;

  @Prop({ default: false })
  isDraft: boolean;
}

export const EmailBuilderSchema = SchemaFactory.createForClass(EmailBuilder);
export type EmailBuilderDocument = EmailBuilder & mongoose.Document;

EmailBuilderSchema.pre('find', function () {
  this.where({ deletedAt: null });
});

EmailBuilderSchema.pre('findOne', function () {
  this.where({ deletedAt: null });
});
