import { Field, Float, ID, ObjectType, PickType } from '@nestjs/graphql';

@ObjectType()
export class AddressType {
  @Field({ nullable: true })
  type: string;
  @Field(() => [Float], { nullable: true })
  coordinates: number[];
  @Field({ nullable: true })
  displayLocation: string;
  @Field({ nullable: true })
  country: string;
  @Field({ nullable: true })
  state: string;
  @Field({ nullable: true })
  city: string;
  @Field({ nullable: true })
  street: string;
  @Field({ nullable: true })
  postalCode: string;
}

@ObjectType()
export class FileResponseType {
  @Field()
  key: string;

  @Field()
  size: string;

  @Field({ nullable: true })
  createdBy: string;
}

@ObjectType()
export class PractitionerInfoType {
  @Field({ nullable: true })
  firstName: string;
  @Field({ nullable: true })
  lastName: string;
  @Field({ nullable: true })
  fullName: string;
}

@ObjectType()
export class ClientContactResponse {
  @Field({ nullable: true })
  _id: string;

  @Field({ nullable: true })
  contactNumber: string;

  @Field({ nullable: true })
  businessPhone: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  businessEmail: string;

  @Field({ nullable: true })
  fullName: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  businessName: string;

  @Field({ nullable: true })
  profession: string;

  @Field({ nullable: true })
  relationship: string;

  @Field({ nullable: true })
  isAlternateBiller: boolean;

  @Field({ nullable: true, defaultValue: false })
  isBillTo: boolean;

  @Field({ nullable: true })
  notes: string;

  @Field(() => AddressType, { nullable: true })
  address: AddressType;
}

@ObjectType()
export class ClientType {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  clientId: string;

  @Field({ nullable: true })
  fullName: string;

  @Field({ nullable: true })
  salutation: string;

  @Field({ nullable: true })
  gender: string;

  @Field({ nullable: true })
  genderIdentity: string;

  @Field({ nullable: true })
  genderSlug: string;

  @Field({ nullable: true })
  genderIdentitySlug: string;

  @Field(() => Date, { nullable: true })
  dateOfBirth: Date;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  preferredName: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  medicalAlerts: string;

  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  business?: string;

  @Field({ nullable: true })
  lastAppointment?: Date;

  @Field({ nullable: true })
  emailMarketing: boolean;

  @Field({ nullable: true })
  nextAppointment?: Date;

  @Field(() => [FileResponseType], { nullable: true })
  filesDocuments: FileResponseType[];

  @Field(() => AddressType, { nullable: true })
  address: AddressType;

  @Field({ nullable: true })
  acquisitionChannel: string;

  @Field({ nullable: true })
  customAcquisitionChannel: string;

  @Field({ nullable: true })
  isDependent: boolean;

  @Field({ nullable: true })
  isArchived: boolean;

  @Field({ nullable: true })
  profilePicture: string;

  @Field({ nullable: true })
  concessionId: string;

  @Field(() => String, { nullable: true })
  appointmentTypeInfo: string;

  @Field(() => [PractitionerInfoType], { nullable: true })
  practitionerInfo: PractitionerInfoType[];

  @Field(() => [ClientContactResponse], { nullable: true })
  clientContacts: ClientContactResponse[];

  @Field({ nullable: true })
  additionalInformation: string;

  @Field({ nullable: true })
  valdAccountLastSyncedAt: Date;

  @Field({ nullable: true })
  valdProfileId: string;

  @Field({ nullable: true })
  valdSyncId: string;

  @Field({ nullable: true })
  physitrackAccountLastSyncedAt: Date;

  @Field({ nullable: true })
  physitrackProfileId: string;

  @Field({ nullable: true })
  physitrackSyncId: string;
}
@ObjectType()
export class CalendarAppointmentUserResponse {
  @Field({ nullable: true, description: 'ID of user.' })
  _id: string;

  @Field({ nullable: true, description: 'Full name of user.' })
  fullName: string;

  @Field({ nullable: true, description: 'S3 key of profile picture.' })
  profilePicture: string;
}

@ObjectType()
export class AppointmentClientResponse extends PickType(ClientType, [
  'fullName',
  'firstName',
  'lastName',
  'fullName',
  '_id',
  'dateOfBirth',
]) {
  @Field({ nullable: true })
  lastName: string;
}

@ObjectType()
export class CalendarClassOccupancyResponse {
  @Field({ description: 'Total bookings count for the class.' })
  occupied: number;

  @Field({ description: 'Total class capacity of the class.' })
  total: number;
}

@ObjectType()
export class CalendarListAppointmentResponse {
  @Field(() => ID, { description: 'Class instance id.' })
  _id: string;

  @Field({ description: 'Class title.', nullable: true })
  title: string;

  @Field({ description: 'Class instance date.', nullable: true })
  date: Date;

  @Field({
    description: 'Class start time (only consider time from date value).',
    nullable: true,
  })
  startTime: Date;

  @Field({
    description: 'Class end time (only consider time from date value).',
    nullable: true,
  })
  endTime: Date;

  @Field({
    description: 'Class color displayed in event calendar',
    nullable: true,
  })
  color: string;

  @Field({
    description: 'Class or Appointment',
    nullable: true,
  })
  type: string;

  @Field({
    description: 'Unavailable block event calendar',
    nullable: true,
  })
  isUnavailableBlock: boolean;

  @Field(() => CalendarAppointmentUserResponse, {
    description: 'Assigned practionar information',
    nullable: true,
  })
  user: CalendarAppointmentUserResponse;

  @Field({
    description: 'Appointment count calendar',
    nullable: true,
    defaultValue: 1,
  })
  count: number;

  @Field({
    description: 'Appointment count calendar',
    nullable: true,
    defaultValue: 1,
  })
  currentCount: number;

  @Field({ nullable: true })
  confirmationStatus: string;
}

@ObjectType()
export class CalendarListClassAppointmentResponse extends CalendarListAppointmentResponse {
  @Field({
    description: 'Address',
    nullable: true,
  })
  @Field({ nullable: true })
  address: string;

  @Field(() => CalendarClassOccupancyResponse, {
    description: 'Class occupancy information',
    nullable: true,
  })
  occupancy: CalendarClassOccupancyResponse;

  @Field({
    description: 'Location timezone',
    nullable: true,
  })
  @Field({ nullable: true })
  locationTimezone: string;

  @Field({ nullable: true })
  unavailableBlockNote: string;

  @Field(() => Boolean, { nullable: true })
  fullyPaid: boolean;

  @Field({ nullable: true })
  status: string;

  @Field(() => [String], { nullable: true })
  appointmentNotes: string[];

  @Field(() => AppointmentClientResponse, { nullable: true })
  client: AppointmentClientResponse;

  @Field({ nullable: true })
  bookedFrom: string;

  @Field({ nullable: true })
  note: string;

  @Field(() => Boolean, { nullable: true })
  isFirstAppointment: boolean;
}

@ObjectType()
export class UserDataResponse {
  @Field({
    nullable: true,
  })
  fullName: string;
  @Field({
    nullable: true,
  })
  profilePicture: string;
  @Field({
    nullable: true,
  })
  userId: string;
  @Field({
    nullable: true,
  })
  _id: string;
}

@ObjectType()
export class LocationDataResponse {
  @Field({
    nullable: true,
  })
  displayName: string;
  @Field({
    nullable: true,
  })
  name: string;
  @Field({
    nullable: true,
  })
  _id: string;

  @Field({
    nullable: true,
  })
  locationTimezone: string;
}

@ObjectType()
export class AppointmentTypesDataResponse {
  @Field({
    nullable: true,
  })
  description: string;
  @Field({
    nullable: true,
  })
  displayName: string;
  @Field({
    nullable: true,
  })
  categoryName: string;
  @Field({
    nullable: true,
  })
  _id: string;
  @Field({
    nullable: true,
  })
  title: string;
}

@ObjectType()
export class CalenderSavedFilterResponse {
  @Field({
    description: 'Business Id',
    nullable: true,
  })
  businessId: string;

  @Field({
    description: 'appointmentDays',
    nullable: true,
  })
  appointmentDays: number;

  @Field(() => [String], {
    description: 'appointmentLocations',
    nullable: true,
  })
  appointmentLocations: string[];

  @Field(() => [String], {
    description: 'appointmentTypes',
    nullable: true,
  })
  appointmentTypes: string[];

  @Field(() => [String], {
    description: 'appointmentPractitioners',
    nullable: true,
  })
  appointmentPractitioners: string[];

  @Field({
    description: 'appointmentSavedAt',
    nullable: true,
  })
  appointmentSavedAt: Date;
  //----

  @Field(() => [UserDataResponse], {
    nullable: true,
  })
  appointmentPractitionersData: UserDataResponse[];

  @Field(() => [LocationDataResponse], {
    nullable: true,
  })
  appointmentLocationsData: LocationDataResponse[];

  @Field(() => [AppointmentTypesDataResponse], {
    nullable: true,
  })
  appointmentTypesData: AppointmentTypesDataResponse[];

  @Field({ nullable: true })
  activeCalendarTab: string;
}
