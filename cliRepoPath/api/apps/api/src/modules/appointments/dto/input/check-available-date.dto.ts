import { IsGreaterThanDate } from '@app/common/decorators/greater-date.decorator';
import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CheckAvailableDateDTO {
  @Field({ description: 'Start time in UTC', nullable: true })
  @IsDate()
  @IsNotEmpty()
  startTime: Date;

  @Field({ description: 'End time in UTC', nullable: true })
  @IsDate()
  @IsGreaterThanDate('startTime')
  @IsNotEmpty()
  endTime: Date;

  @Field({ description: 'Apointment date in UTC', nullable: true })
  @IsDate()
  appointmentDate: Date;

  @Field(() => [String], { description: 'Practitioners', nullable: true })
  practitionerIds: string[];

  @Field({ description: 'appointmentInstanceId', nullable: true })
  appointmentInstanceId: string;

  @Field(() => Number, { description: 'Time zone offset' })
  @IsNotEmpty()
  timeZoneOffset: number;

  @Field(() => String, {
    description: 'Location id (Mongo id)',
    nullable: true,
  })
  @IsOptional()
  @IsMongoId()
  locationId: string;
}
