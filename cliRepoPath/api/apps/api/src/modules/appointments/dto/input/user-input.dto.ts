import { PagMetaDTO } from '@app/common/dto/input/base-pagination.dto';
import { UserRoles } from '@app/common/enum/appointment.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class GetStaffsScheduleDTO {
  @Field(() => [String], {
    nullable: true,
    description: 'staff ids',
  })
  @IsOptional()
  staffIds?: string[];

  @Field({ description: 'Start date in UTC.', nullable: true })
  @IsDate()
  @IsOptional()
  startDate: Date;

  @Field({ description: 'End date in UTC.', nullable: true })
  @IsDate()
  @IsOptional()
  endDate: Date;

  @Field({ description: 'Timezone region of browser' })
  timezoneRegion: string;
}

@InputType()
export class GetPractitionerByLocationDTO {
  @Field(() => [String], {
    description: 'staff ids',
  })
  @IsNotEmpty()
  locationIds: string[];

  @Field({ description: 'Start date in UTC.' })
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Field({ description: 'End date in UTC.' })
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @Field({ nullable: true })
  dayRange: string;
}

@InputType()
export class InputValueForUsers {
  @Field({
    nullable: true,
    description: 'Search user.',
  })
  @IsOptional()
  @IsString()
  searchValue?: string;

  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean)
  isClient: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  hasPhone?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isSupervisor?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsEnum(UserRoles)
  role?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsEnum(UserRoles, { each: true })
  roleArray?: string[];

  @Field()
  pageMeta: PagMetaDTO;

  @Field({ defaultValue: false, nullable: true })
  @IsOptional()
  practitionerOrder: boolean;

  @Field({ nullable: true })
  showConcessionName: boolean;

  @Field({ nullable: true })
  isDependent: boolean;
}
