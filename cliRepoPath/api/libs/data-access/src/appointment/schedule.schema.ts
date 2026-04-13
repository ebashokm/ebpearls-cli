import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ScheduleDocument = Schedule & Document;

@Schema()
export class ScheduleShift {
  @Prop({
    required: true,
    ref: 'locations',
    index: true,
  })
  locationId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop()
  timezoneRegion: string;
}

export const scheduleShiftSchema = SchemaFactory.createForClass(ScheduleShift);

@Schema({ timestamps: true })
export class Schedule {
  @Prop({
    required: true,
    ref: 'users',
    index: true,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: () => [scheduleShiftSchema], default: [] })
  sunday: ScheduleShift[];

  @Prop({ type: () => [scheduleShiftSchema], default: [] })
  monday: ScheduleShift[];

  @Prop({ type: () => [scheduleShiftSchema], default: [] })
  tuesday: ScheduleShift[];

  @Prop({ type: () => [scheduleShiftSchema], default: [] })
  wednesday: ScheduleShift[];

  @Prop({ type: () => [scheduleShiftSchema], default: [] })
  thursday: ScheduleShift[];

  @Prop({ type: () => [scheduleShiftSchema], default: [] })
  friday: ScheduleShift[];

  @Prop({ type: () => [scheduleShiftSchema], default: [] })
  saturday: ScheduleShift[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
