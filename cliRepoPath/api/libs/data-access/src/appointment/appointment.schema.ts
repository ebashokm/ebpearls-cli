import { AppointmentStatus, BookedFromType } from '@app/common/enum/appointment.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';
import { RecurrencePattern, recurrencePatternSchema } from './recurrrence-pattern.schema';
export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ ref: 'Locations' })
  addressId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  appointmentTypeId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: [MongooseSchema.Types.ObjectId] })
  practitionerIds: MongooseSchema.Types.ObjectId[];

  @Prop({ ref: 'Case', required: false, type: MongooseSchema.Types.ObjectId })
  caseId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  startTime: Date;

  @Prop({ required: false })
  endTime: Date;

  @Prop({ required: false })
  note: string;

  @Prop({ required: false })
  unavailableBlockNote: string;

  @Prop({
    type: String,
    default: AppointmentStatus.upcoming,
  })
  status: AppointmentStatus;

  @Prop({ required: false, ref: 'User' })
  clientId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, ref: 'User' })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    ref: 'Business',
    index: true,
  })
  businessId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  startDate: Date;

  @Prop({ required: false })
  endDate: Date;

  @Prop({
    required: true,
  })
  isRecurring: boolean;

  @Prop(() => recurrencePatternSchema)
  recurrencePattern: RecurrencePattern;

  @Prop({
    default: false,
  })
  isUnavailableBlock: boolean;

  @Prop({
    default: false,
  })
  multiPractitioner: boolean;

  @Prop({ required: false })
  deletedAt: Date;

  @Prop({ default: false })
  isImported: boolean;

  @Prop({ default: null })
  importedId: string;

  @Prop()
  timezoneRegion: string;

  @Prop({ type: 'string', default: BookedFromType.web })
  bookedFrom: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

AppointmentSchema.pre('find', function () {
  this.where({ deletedAt: null });
});

AppointmentSchema.pre('findOne', function () {
  this.where({ deletedAt: null });
});
