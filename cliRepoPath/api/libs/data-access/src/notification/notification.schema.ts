import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

class ThemeAttributes {
  [key: string]: any;
}

@Schema({ timestamps: true, autoCreate: true, autoIndex: true })
export class Notification {
  @Prop({
    required: true,
    ref: 'User',
    type: SchemaTypes.ObjectId,
  })
  userId: string;

  @Prop({ required: true, type: String })
  theme: string;

  @Prop()
  themeAttributes: ThemeAttributes;

  @Prop()
  description: string;

  @Prop()
  readAt: Date;

  @Prop()
  viewedAt: Date;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
