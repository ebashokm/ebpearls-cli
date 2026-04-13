import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TimezoneDocument = Timezone & Document;

@Schema({ timestamps: true })
export class Timezone {
  @Prop()
  name: string;

  @Prop()
  offsetHours: number;

  @Prop()
  offsetMinutes: number;

  @Prop({ default: false })
  default: boolean;
}

export const TimezoneSchema = SchemaFactory.createForClass(Timezone);
