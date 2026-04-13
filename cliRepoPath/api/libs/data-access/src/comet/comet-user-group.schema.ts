import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CometUserGroupDocument = mongoose.Document & CometUserGroup;

@Schema({ timestamps: true, autoIndex: true })
export class CometUserGroup {
  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  propertyOwnerId: string;

  @Prop({
    // put ref of the property
    required: true,
  })
  propertyId: string;

  @Prop({ required: true, unique: true })
  guid: string;

  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  requesterId: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const CometUserGroupSchema = SchemaFactory.createForClass(CometUserGroup);
