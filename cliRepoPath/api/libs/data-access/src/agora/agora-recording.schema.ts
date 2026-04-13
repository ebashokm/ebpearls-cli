import { Recording } from '@app/common/enum/recording.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';

export type AgoraRecordingDocument = AgoraRecording & mongoose.Document;

@Schema({ timestamps: true })
export class AgoraRecording {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  cname: string;


  @Prop()
  sid: string;

  @Prop()
  uid: number;


  @Prop()
  resourceId: string;

  @Prop({  type: String,
      required: true,
      enum: Recording,
      default: Recording.recording, })
  status: Recording; 


  @Prop({ type: mongoose.Schema.Types.Mixed, default: [] })
  recordingFileList: any[];

}

export const AgoraRecordingSchema = SchemaFactory.createForClass(AgoraRecording);
