import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';

export type AppointmentSettingsDocument = AppointmentSettings & Document;

@Schema({ timestamps: true })
export class AppointmentSettings {
  //appointment calendar settings

  //in minutes
  @Prop({ required: true, type: Number })
  displayTimeIncrements: number;

  @Prop({ required: true })
  hoursOfOperationStartTime: Date;

  @Prop({ required: true })
  hoursOfOperationEndTime: Date;

  @Prop({ required: true })
  leaveGap: boolean;

  @Prop({ required: true })
  showCurrentTimeIndicator: boolean;

  @Prop({ required: true })
  cancelOwnAppointments: boolean;

  //minimum notice for cancellation
  @Prop({ required: true })
  automaticallyChargeForCancellation: boolean;

  @Prop({ required: true, type: Number })
  cancellationAmount: number;

  @Prop({ required: true, type: Number })
  numberOf: number;

  @Prop({ required: true })
  unitOfTime: string;

  //online/in-app bookings
  //-1 for all available, 1-10 for specific counts
  @Prop({ required: true, type: Number })
  maxAppointments: number;

  @Prop({ required: true, type: Number })
  dailyClientLimit: number;

  @Prop({ required: true, type: Number })
  leadTimeForBookingsNumber: number;

  @Prop({ required: true, type: String })
  leadTimeForBookingsUnit: string;

  @Prop({ required: true, type: Number })
  farAheadForOnlineBookingsNumber: number;

  @Prop({ required: true, type: String })
  farAheadForOnlineBookingsUnit: string;

  //in minutes
  @Prop({ required: true, type: Number })
  onlineBookingInProcessReservationLength: number;

  @Prop({ required: true, type: Boolean, default: false })
  showPrices: boolean;

  @Prop({ required: true })
  showAppointmentDuration: boolean;

  @Prop({ required: true })
  setCustomPractitionerOrder: boolean;

  @Prop({ required: true, ref: 'User', type: [MongooseSchema.Types.ObjectId] })
  teamMembersOrder: MongooseSchema.Types.ObjectId[];

  @Prop()
  notesDisplayed: string;

  @Prop({
    required: true,
    ref: 'Business',
    index: true,
  })
  businessId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, ref: 'User', type: [MongooseSchema.Types.ObjectId] })
  onlinePractitioners: MongooseSchema.Types.ObjectId[];

  @Prop({ required: false })
  timezoneRegion: string;

  // Time slot increments for online/app bookings (in minutes)
  // -1 represents appointment duration (no downtime between appointments)
  @Prop({
    required: false,
    type: [Number],
  })
  timeSlotIncrements: number[];

  @Prop({
    required: true,
    ref: 'AppointmentCategory',
    type: [MongooseSchema.Types.ObjectId],
  })
  appointmentCategoryOrder: MongooseSchema.Types.ObjectId[];

  @Prop({
    required: true,
    ref: 'AppointmentType',
    type: [MongooseSchema.Types.ObjectId],
  })
  appointmentTypeOrder: MongooseSchema.Types.ObjectId[];
}

export const AppointmentSettingsSchema = SchemaFactory.createForClass(AppointmentSettings);
