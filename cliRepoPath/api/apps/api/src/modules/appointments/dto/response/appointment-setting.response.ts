import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AppointmentSettingsTeamMembersDetail {
  @Field(() => ID)
  _id: string;

  @Field(() => String, { nullable: true })
  profilePicture: string;

  @Field(() => String, { nullable: true })
  fullName: string;
}

@ObjectType()
export class AppointmentCategoryTypeDetail {
  @Field(() => ID)
  _id: string;

  @Field(() => String, { nullable: true })
  title: string;
}

@ObjectType()
export class AppointmentSettingsPractitionersDetail {
  @Field(() => ID)
  _id: string;

  @Field(() => String, { nullable: true })
  profilePicture: string;

  @Field(() => String, { nullable: true })
  fullName: string;

  @Field(() => Date, { nullable: true })
  archiveDate: Date;
}
@ObjectType()
export class GetAppointmentSettingsDetailResponse {
  @Field(() => Number)
  displayTimeIncrements: number;

  @Field(() => Date)
  hoursOfOperationStartTime: Date;

  @Field(() => Date)
  hoursOfOperationEndTime: Date;

  @Field(() => Boolean)
  leaveGap: boolean;

  @Field(() => Boolean)
  showCurrentTimeIndicator: boolean;

  @Field(() => Boolean)
  cancelOwnAppointments: boolean;

  @Field(() => Boolean)
  automaticallyChargeForCancellation: boolean;

  @Field(() => Number)
  cancellationAmount: number;

  @Field(() => Number)
  numberOf: number;

  @Field(() => String)
  unitOfTime: string;

  @Field(() => Number)
  maxAppointments: number;

  @Field(() => Number)
  dailyClientLimit: number;

  @Field(() => Number, { nullable: true })
  leadTimeForBookingsNumber: number;

  @Field(() => String, { nullable: true })
  leadTimeForBookingsUnit: string;

  @Field(() => Number)
  farAheadForOnlineBookingsNumber: number;

  @Field(() => String)
  farAheadForOnlineBookingsUnit: string;

  @Field(() => Number)
  onlineBookingInProcessReservationLength: number;

  @Field(() => Boolean, { nullable: true })
  showPrices: boolean;

  @Field(() => Boolean)
  showAppointmentDuration: boolean;

  @Field(() => Boolean)
  setCustomPractitionerOrder: boolean;

  @Field(() => [AppointmentSettingsTeamMembersDetail])
  teamMembersOrder: AppointmentSettingsTeamMembersDetail[];

  @Field(() => [AppointmentSettingsPractitionersDetail], { nullable: true })
  practitioners: AppointmentSettingsPractitionersDetail[];

  @Field(() => String, { nullable: true })
  notesDisplayed: string;

  @Field(() => Date, { nullable: true })
  farAheadForOnlineBookingsEndDate: Date;

  @Field(() => [AppointmentSettingsPractitionersDetail], { nullable: true })
  onlinePractitioners: AppointmentSettingsPractitionersDetail[];

  @Field(() => String, { nullable: true })
  timezoneRegion: string;

  @Field(() => [Number], {
    nullable: true,
    description:
      'Time slot increments for online/app bookings (in minutes). -1 represents appointment duration (no downtime between appointments).',
  })
  timeSlotIncrements: number[];

  @Field(() => [AppointmentCategoryTypeDetail], { nullable: true })
  appointmentCategoryOrder: AppointmentCategoryTypeDetail[];

  @Field(() => [AppointmentCategoryTypeDetail], { nullable: true })
  appointmentTypeOrder: AppointmentCategoryTypeDetail[];
}
