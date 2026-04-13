import { EmailType } from '@app/common/enum/user-status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class CommunicationEmail {
  @Prop({ required: true })
  emailName: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  isMarketing: boolean;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  fromEmail: string;

  @Prop({ nullable: true })
  audienceId: string;

  @Prop()
  clientIds: MongooseSchema.Types.ObjectId[];

  @Prop()
  tags: string;

  @Prop()
  recipients: string;

  @Prop()
  businessId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  templateId: MongooseSchema.Types.ObjectId;

  @Prop({ default: EmailType.FANCYEMAIL })
  emailType: string;

  @Prop({ required: false })
  emailContent: string;

  @Prop({ required: false })
  deletedAt: Date;

  @Prop()
  createdAt: Date;

  @Prop({ default: 0 })
  totalEmailSent: number;

  @Prop({ default: false })
  isCompletedFullProcess: boolean;

  @Prop({ default: false })
  isDraft: boolean;

  @Prop({ nullable: true })
  emailTemplateId: MongooseSchema.Types.ObjectId;
}

export const CommunicationEmailSchema = SchemaFactory.createForClass(CommunicationEmail);
export type CommunicationEmailDocument = CommunicationEmail & mongoose.Document;

CommunicationEmailSchema.pre('find', function () {
  this.where({ deletedAt: null });
});

CommunicationEmailSchema.pre('findOne', function () {
  this.where({ deletedAt: null });
});
