import { CalendarActiveTabEnum } from '@app/common/enum/appointment.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsMongoId, IsOptional } from 'class-validator';

@InputType()
export class SaveClassAppointmentFilterDTO {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  classLocations: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  classTypes: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  classCoaches: string[];

  @Field({ description: 'Filter type', nullable: false })
  filterType: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  appointmentLocations: string[];

  @Field({ nullable: true })
  @IsOptional()
  appointmentDays: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  appointmentTypes: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  appointmentPractitioners: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(CalendarActiveTabEnum)
  activeCalendarTab: CalendarActiveTabEnum;
}
