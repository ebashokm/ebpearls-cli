import { CalendarActiveTabEnum } from '@app/common/enum/appointment.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Schema as MongooseSchema } from 'mongoose';

export type CalenderFilterDocument = CalenderFilter & mongoose.Document;

@Schema({ timestamps: true })
export class CalenderFilter {
  @Prop({
    required: true,
    ref: 'Business',
    index: true,
  })
  businessId: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    ref: 'User',
    index: true,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, type: [MongooseSchema.Types.ObjectId] })
  classLocations: MongooseSchema.Types.ObjectId[];

  @Prop({ required: false, type: [MongooseSchema.Types.ObjectId] })
  classTypes: MongooseSchema.Types.ObjectId[];

  @Prop({ required: false, type: [MongooseSchema.Types.ObjectId] })
  classCoaches: MongooseSchema.Types.ObjectId[];

  @Prop({ required: false, default: null })
  classSavedAt: Date;

  @Prop({ required: false, type: Number })
  appointmentDays: number;

  @Prop({ required: false, type: [MongooseSchema.Types.ObjectId] })
  appointmentLocations: MongooseSchema.Types.ObjectId[];

  @Prop({ required: false, type: [MongooseSchema.Types.ObjectId] })
  appointmentTypes: MongooseSchema.Types.ObjectId[];

  @Prop({ required: false, type: [MongooseSchema.Types.ObjectId] })
  appointmentPractitioners: MongooseSchema.Types.ObjectId[];

  @Prop({ required: false, default: null })
  appointmentSavedAt: Date;

  @Prop({
    type: String,
    enum: CalendarActiveTabEnum,
    default: CalendarActiveTabEnum.APPOINTMENT,
  })
  activeCalendarTab: CalendarActiveTabEnum;
}

export const CalenderFilterSchema = SchemaFactory.createForClass(CalenderFilter);
