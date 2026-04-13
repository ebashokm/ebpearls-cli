import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AddressType, ClientType } from './appointment-list.response';

@ObjectType()
export class TimezoneInfo {
  @Field({ nullable: true })
  _id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  offsetInMinutes: number;

  @Field({ nullable: true })
  default: boolean;
}

@ObjectType()
export class RecurrencePatternResponse {
  @Field({ nullable: true })
  startDate: Date;

  @Field({ nullable: true })
  endDate: Date;

  @Field({ nullable: true })
  frequency: string;

  @Field({ nullable: true })
  interval: number;

  @Field({ nullable: true })
  endType: string;

  @Field({ nullable: true })
  endAfterOccurrence: number;

  @Field({ nullable: true })
  monthOfYear: number;

  @Field(() => [Number], { nullable: true })
  daysOfWeek: number[];

  @Field({ nullable: true })
  dayOfWeek: number;

  @Field({ nullable: true })
  weekOfMonth: number;

  @Field({ nullable: true })
  dayOfMonth: number;
}

@ObjectType()
export class AppointmentInfo {
  @Field({ nullable: true })
  isRecurring: boolean;

  @Field(() => RecurrencePatternResponse, { nullable: true })
  recurrencePattern: RecurrencePatternResponse;

  @Field({ nullable: true })
  addressId?: string;
}

@ObjectType()
export class LocationResponseType {
  @Field({ nullable: true })
  name: string;

  @Field(() => AddressType, { nullable: true })
  locationAddress: AddressType;

  @Field(() => ID, { nullable: true })
  _id: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  timezoneId: string;

  @Field({ nullable: true })
  isUsed: boolean;
}

@ObjectType()
export class AppointmentTypeResponseDetail {
  @Field({ nullable: true })
  _id: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  color: string;

  @Field({ nullable: true })
  minimumOnlinePayment?: number;

  @Field({ nullable: true })
  multiPractitioner: boolean;

  @Field({ nullable: true })
  treatmentNoteTemplateId: string;

  @Field({ nullable: true })
  cancellationAmount?: number;

  @Field({ nullable: true })
  automaticallyChargeForCancellation?: boolean;

  @Field({ nullable: true })
  duration?: number;
}

@ObjectType()
export class PractitionerResponse {
  @Field({ nullable: true })
  _id: string;

  @Field({ nullable: true })
  fullName: string;

  @Field({ nullable: true })
  profilePicture: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  role: string;
}

@ObjectType()
export class AppointmentInstanceDetailResponse {
  @Field({ nullable: true })
  _id: string;

  @Field({ nullable: true })
  appointmentId: string;

  @Field(() => AppointmentTypeResponseDetail, { nullable: true })
  adminBlock: AppointmentTypeResponseDetail;

  @Field({ nullable: true })
  addressId: string;

  @Field({ nullable: true })
  appointmentName: string;

  @Field(() => AppointmentTypeResponseDetail, { nullable: true })
  appointmentType: AppointmentTypeResponseDetail;

  @Field(() => [PractitionerResponse], { nullable: true })
  practitioners: PractitionerResponse[];

  @Field(() => ClientType, { nullable: true })
  client: ClientType;

  @Field({ nullable: true })
  startDate: Date;

  @Field({ nullable: true })
  endDate: Date;

  @Field({ nullable: true })
  instanceDate: Date;

  @Field({ nullable: true })
  startTime: Date;

  @Field({ nullable: true })
  endTime: Date;

  @Field({ nullable: true })
  businessId: string;

  @Field({ nullable: true })
  note: string;

  @Field({ nullable: true })
  unavailableBlockNote: string;

  @Field({ nullable: true })
  isUnavailableBlock: boolean;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  isRecurring: boolean;

  @Field(() => AppointmentInfo, { nullable: true })
  appointmentInfo: AppointmentInfo;

  @Field(() => LocationResponseType, { nullable: true })
  location: LocationResponseType;

  @Field({ nullable: true })
  clientMembershipId?: string;

  @Field({ nullable: true })
  coveredBy?: string;

  @Field({ nullable: true })
  clientMembership?: string;

  @Field({ nullable: true })
  isInvoicePaid?: boolean;

  @Field({ nullable: true })
  isInvoiceCreated?: boolean;

  @Field({ nullable: true })
  fullyPaid: boolean;

  @Field({ nullable: true })
  invoiceId: string;

  @Field({ nullable: true })
  cancelReason: string;

  @Field({ nullable: true })
  cancelNote: string;

  @Field({ nullable: true })
  isInvoicePaidPartially?: boolean;

  @Field(() => TimezoneInfo, { nullable: true })
  locationTimezoneInfo: TimezoneInfo;

  @Field({ nullable: true })
  hasEarly: boolean;

  @Field({ nullable: true })
  confirmationStatus: string;
}

@ObjectType()
export class GetAllClientFutureBookingsForAnAppointmentType {
  @Field(() => ID, { description: 'Appointment booking id.' })
  _id: string;

  @Field({
    description: 'Appointment start time (only consider time from date value).',
  })
  startTime: Date;

  @Field({
    description: 'Is an unavailable block record.',
  })
  isUnavailableBlock: boolean;
}

@ObjectType()
export class GetAllClientFutureBookingsForAnAppointmentResponse {
  @Field(() => [GetAllClientFutureBookingsForAnAppointmentType], {
    nullable: true,
  })
  data: GetAllClientFutureBookingsForAnAppointmentType[];
}
