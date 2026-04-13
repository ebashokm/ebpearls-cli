import { PagMetaDTO } from '@app/common/dto/input/base-pagination.dto';
import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsDate, IsMongoId, IsOptional } from 'class-validator';

@InputType()
export class CalendarListAppointmentDTO {
  @Field()
  pageMeta: PagMetaDTO;

  @Field({ description: 'Start date in UTC.' })
  @IsDate()
  startDate: Date;

  @Field({ description: 'End date in UTC.' })
  @IsDate()
  endDate: Date;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  appointmentTypeIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  addressIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  coachIds?: string[];
}

@InputType()
export class CalendarListClassAppointmentDTO extends CalendarListAppointmentDTO {
  @Field(() => [String], {
    nullable: true,
    description: 'Valid class type id(mongoId) of business',
  })
  @IsMongoId({ each: true })
  @IsOptional()
  classTypeId?: string[];

  @Field(() => [String], {
    nullable: true,
    description: 'Valid location id(mongoId) of business',
  })
  @IsMongoId({ each: true })
  @IsOptional()
  addressId?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  clientIds?: string[];

  @Field(() => String, { nullable: true, defaultValue: 'class' })
  @IsOptional()
  fromPage?: string;

  @Field({ nullable: false })
  timeOffsetInMinute: number;
}
