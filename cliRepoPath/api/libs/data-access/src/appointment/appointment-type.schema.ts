import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';

export type AppointmentTypeDocument = AppointmentType & Document;

class AppointmentNotificationTemplate {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  appTemplate: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  emailTemplate: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  smsTemplate: MongooseSchema.Types.ObjectId;

  @Prop()
  notificationTimer: number;
}

@Schema({ timestamps: true })
export class AppointmentType {
  // details
  @Prop()
  title: string;

  @Prop()
  category: MongooseSchema.Types.ObjectId;

  @Prop()
  description: string;

  @Prop()
  duration: number;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDraft: boolean;

  @Prop({
    default: false,
  })
  multiPractitioner: boolean;

  @Prop({
    default: false,
  })
  multiPatient: boolean;

  @Prop({
    default: false,
  })
  trackTreatmentNotes: boolean;

  @Prop()
  color: string;
  // details

  //practitioner
  @Prop([MongooseSchema.Types.ObjectId])
  practitioner: MongooseSchema.Types.ObjectId[];
  //practitioner

  // billing details
  @Prop({
    default: false,
  })
  allowOnlineBooking: boolean;

  // @Prop({
  //   default: false,
  // })
  // allowTeleHealth: boolean;

  @Prop({ type: Boolean, default: true })
  discountApplicable: boolean;

  @Prop({ type: Boolean, default: true })
  concessionApplicable: boolean;

  @Prop({ type: Boolean, default: true })
  paymentRequiredOnline: boolean;

  @Prop({ type: Number })
  minimumOnlinePayment: number;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  billingItemId: MongooseSchema.Types.ObjectId;

  @Prop()
  billingItemPrice: number;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  treatmentNoteTemplateId: MongooseSchema.Types.ObjectId;

  @Prop([MongooseSchema.Types.ObjectId])
  accessibleLocations: MongooseSchema.Types.ObjectId[];
  // billing details

  // communication
  @Prop({ type: () => AppointmentNotificationTemplate })
  bookingNotification: AppointmentNotificationTemplate;

  @Prop({ type: () => AppointmentNotificationTemplate })
  reminderNotification: AppointmentNotificationTemplate;

  @Prop({ type: () => AppointmentNotificationTemplate })
  cancellationNotification: AppointmentNotificationTemplate;

  @Prop({ type: () => AppointmentNotificationTemplate })
  dnaNotification: AppointmentNotificationTemplate;
  // communication

  @Prop({ type: MongooseSchema.Types.ObjectId })
  waiverTemplate: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    ref: 'Business',
    index: true,
  })
  businessId: MongooseSchema.Types.ObjectId;

  _id: mongoose.Types.ObjectId;

  @Prop({ default: false })
  isImported: boolean;

  @Prop({ default: null })
  importedId: string;

  // moved from class setting
  @Prop({ type: Boolean, default: true })
  automaticallyChargeForCancellation: boolean;

  @Prop({ type: Number })
  cancellationAmount: number;
}

export const AppointmentTypeSchema = SchemaFactory.createForClass(AppointmentType);
