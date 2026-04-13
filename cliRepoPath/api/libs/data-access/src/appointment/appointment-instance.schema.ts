import { AppointmentStatus } from '@app/common/enum/appointment.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AppointmentInstanceDocument = AppointmentInstance & Document;

import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class AppointmentInstance {
  @Prop({ required: true, ref: 'Appointment', index: true })
  appointmentId: MongooseSchema.Types.ObjectId;

  @Prop({ ref: 'Locations' })
  addressId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, ref: 'AppointmentType', index: true })
  appointmentTypeId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, ref: 'AdminBlock', index: true })
  adminBlockId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: [MongooseSchema.Types.ObjectId] })
  practitionerIds: MongooseSchema.Types.ObjectId[];

  @Prop({ required: false })
  startTime: Date;

  @Prop({ required: false })
  endTime: Date;

  @Prop({ required: false })
  note: string;

  @Prop({ required: false })
  unavailableBlockNote: string;

  @Prop({
    default: false,
  })
  isUnavailableBlock: boolean;

  @Prop({
    type: String,
    default: AppointmentStatus.upcoming,
  })
  status: AppointmentStatus;

  @Prop({ required: false, ref: 'User' })
  clientId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, ref: 'User' })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ ref: 'User' })
  updatedBy: MongooseSchema.Types.ObjectId;

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

  @Prop({ default: false })
  hasEarly: boolean;

  @Prop({ required: true })
  instanceDate: Date; // the date for which instance is created

  @Prop({ required: false, default: null })
  cancelReason: string;

  @Prop({ required: false, default: null })
  cancelNote: string;

  @Prop({
    type: String,
  })
  paymentStatus: string; // unpaid| paid vai card| paid vai membership

  @Prop({
    type: String,
  })
  coveredBy: string; // membership| payment

  @Prop({ ref: 'ClientMembership', index: true, required: false })
  clientMembershipId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  deletedAt: Date;

  @Prop({ default: false })
  isImported: boolean;

  @Prop({ default: false })
  reminderNotificationSent: boolean;

  @Prop({ default: null })
  importedId: string;

  @Prop()
  timezoneRegion: string;

  @Prop({ required: false })
  cancelledAt: Date;

  @Prop({ required: false, type: String })
  statusBeforeDelete: AppointmentStatus;

  @Prop({ type: Object })
  coverageInfoBeforeCancel: any; // set when booking is cancelled

  @Prop()
  generatedFromCronAt: Date;
  @Prop({ required: false })
  checkInBullJobId: string;

  @Prop({ required: false })
  noShowBullJobId: string;

  @Prop({
    required: false,
    default: 'false',
  })
  isShowInListing: boolean;

  @Prop({
    required: false,
    default: 'false',
  })
  showOnDashboardIncompleteNoteList: boolean;

  @Prop({
    required: false,
    default: 'false',
  })
  isFirstAppointment: boolean;

  @Prop()
  oldCaseId: MongooseSchema.Types.ObjectId;
}

export const AppointmentInstanceSchema = SchemaFactory.createForClass(AppointmentInstance);

AppointmentInstanceSchema.pre('find', function () {
  this.where({ deletedAt: null });
});

AppointmentInstanceSchema.pre('findOne', function () {
  this.where({ deletedAt: null });
});

AppointmentInstanceSchema.index({ clientId: 1, businessId: 1, startTime: 1 });
