import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { RecurrencePatternDTO } from '@app/common/dto/input/recurrence-pattern.dto';
import { IsValidTimezoneRegion } from '@app/common/decorators/timezone-region-validation.decorator';
import {
  EarlyAppointmentShifts,
  UpdateAppointmenAction,
  UpdateAppointmentOption,
} from '@app/common/enum/appointment.enum';

import { IsGreaterThanDate } from '@app/common/decorators/greater-date.decorator';

@InputType()
export class AppointmentClient {
  @Field({ description: 'addClient' })
  addClient: boolean;

  @Field({ description: 'Client Salutation' })
  clientSalutation: string;

  @Field({ description: 'Client First Name' })
  clientFirstName: string;

  @Field({ description: 'Client Last Name' })
  clientLastName: string;

  @Field({ description: 'Email' })
  clientEmail: string;

  @Field(() => Date, { description: 'Date Of Birth' })
  clientDateOfBirth: Date;

  @Field({ description: 'Client Phone number', nullable: true })
  clientPhone?: string;
}

@InputType()
export class NewCaseDTO {
  @IsOptional()
  @Field({ nullable: true, description: 'Case limit' })
  caseLimit: number;

  @IsOptional()
  @Field({ nullable: true, description: 'Case monitoring' })
  caseMonitoring: string;

  @IsOptional()
  @Field({ nullable: true, description: 'Case expiry date' })
  expiryDate: string;

  @IsOptional()
  @Field(() => [String], { nullable: true, description: 'Case include' })
  include: string[];

  @IsOptional()
  @Field({ nullable: true, description: 'Case issued date' })
  issuedDate: string;

  @IsNotEmpty()
  @Field({ nullable: true, description: 'Case name' })
  name: string;

  @IsOptional()
  @ValidateIf((o) => o.note)
  @MaxLength(1000)
  @Field({ nullable: true, description: 'Case note' })
  note: string;

  @IsOptional()
  @Field({ nullable: true, description: 'Case referral' })
  referral: string;

  @IsOptional()
  @Field(() => String, { nullable: true, description: 'Case referral type' })
  referralType: string;
}

@InputType()
export class DaysAndShiftsType {
  @Field(() => Number, { nullable: true })
  @IsIn([0, 1, 2, 3, 4, 5, 6])
  dayOfWeek: number;

  @IsNotEmpty()
  @Field(() => [String], {
    description: 'Early appointment shifts',
  })
  @IsEnum(EarlyAppointmentShifts, {
    each: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  shifts: string[];

  @IsOptional()
  @Field({ nullable: true })
  @ValidateIf((earlyShift) => earlyShift.note !== '')
  @MinLength(3)
  @MaxLength(1000)
  note: string;
}

@InputType()
export class CreateAppointmentDTO {
  @Field(() => AppointmentClient, { description: 'client', nullable: true })
  client: AppointmentClient;

  @Field({ description: 'isUnavailableBlock' })
  isUnavailableBlock: boolean;

  @Field({ description: 'Unavailable Block Note', nullable: true })
  @ValidateIf((o) => o.isUnavailableBlock === true)
  unavailableBlockNote: string;

  @Field({ description: 'Admin block id', nullable: true })
  @ValidateIf((o) => o.isUnavailableBlock === true && !o.instanceId)
  @IsMongoId()
  @IsNotEmpty()
  adminBlockId: string;

  @Field({ description: 'Case type id', nullable: true })
  @ValidateIf((o) => o.isUnavailableBlock === false)
  caseId: string;

  @Field(() => NewCaseDTO, {
    nullable: true,
    description: 'Recurrence pattern. required if isRecurring is set to true',
  })
  @ValidateIf((o) => o.isUnavailableBlock === false)
  @Type(() => NewCaseDTO)
  newCase: NewCaseDTO;

  @IsNotEmpty()
  @Field(() => [String], { description: 'Array of id of practitioners' })
  @IsArray()
  @MinLength(1, { each: true })
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  practitionerIds: string[];

  @Field({ description: 'Appointment type id', nullable: true })
  @ValidateIf((o) => o.isUnavailableBlock === false)
  @IsMongoId()
  @IsNotEmpty()
  appointmentTypeId: string;

  @Field({ description: 'Address id', nullable: true })
  @ValidateIf((o) => o.isUnavailableBlock === false)
  @IsMongoId()
  @IsNotEmpty()
  addressId: string;

  @Field({ description: 'Start time in UTC', nullable: true })
  @IsDate()
  @IsNotEmpty()
  startTime: Date;

  @Field({ description: 'End time in UTC', nullable: true })
  @IsDate()
  @IsGreaterThanDate('startTime')
  @IsNotEmpty()
  endTime: Date;

  @Field({ description: 'Treatment note', nullable: true })
  // @MaxLength(1000, { message: lang.INVALID_APPOINTMENT_NOTE_LENGTH })
  note: string;

  @Field({ description: 'Client id(mongo id)', nullable: true })
  @ValidateIf((o) => o.isUnavailableBlock === false && o.client === null)
  @IsMongoId()
  clientId: string;

  @Field({ description: 'Start date in UTC', nullable: true })
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Field({ description: 'Boolean to set is recurring' })
  isRecurring: boolean;

  @Field(() => RecurrencePatternDTO, {
    nullable: true,
    description: 'Recurrence pattern. required if isRecurring is set to true',
  })
  @ValidateIf((o) => o.isRecurring === true)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RecurrencePatternDTO)
  recurrencePattern: RecurrencePatternDTO;

  @Field()
  @IsNotEmpty()
  @IsValidTimezoneRegion({ message: 'Invalid timezone region' })
  timezoneRegion: string;

  @Field(() => [DaysAndShiftsType], {
    nullable: true,
    description: 'Early appointment details',
  })
  @ValidateIf((o) => o.hasEarly)
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => DaysAndShiftsType)
  earlyAppointmentDetails: DaysAndShiftsType[];

  @Field({
    nullable: true,
    description: 'Flag to define if the booking has an early appointment request or not',
  })
  hasEarly: boolean;
}

@InputType()
export class EditAppointmentDTO extends CreateAppointmentDTO {
  @Field({ description: 'appointment id' })
  @IsNotEmpty()
  @IsMongoId()
  instanceId: string;

  @Field({ description: 'appointment id', defaultValue: false })
  updateAll: boolean;

  @Field(() => String)
  @IsNotEmpty()
  @IsEnum(UpdateAppointmentOption)
  updateOption: UpdateAppointmentOption;

  @IsOptional()
  @Field(() => String, {
    description: 'update appointment action',
    defaultValue: null,
    nullable: true,
  })
  action?: UpdateAppointmenAction;
}
