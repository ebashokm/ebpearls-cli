import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Chime {
  @Prop({ required: true })
  meetingId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export type ChimeDocument = mongoose.Document & Chime;
export const ChimeSchema = SchemaFactory.createForClass(Chime);
