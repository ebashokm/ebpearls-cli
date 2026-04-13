import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ScheduleResponse {
  @Field({ nullable: true })
  endTime?: string;

  @Field()
  startTime?: string;

  @Field()
  locationId?: string;

  @Field({ nullable: true })
  timezoneRegion?: string;

  @Field({ nullable: true })
  isOnceOff?: string;
}

@ObjectType()
export class GetStaffsScheduleResponse {
  @Field({ nullable: true })
  userId?: string;

  @Field(() => [ScheduleResponse], { nullable: true })
  sunday?: ScheduleResponse[];

  @Field(() => [ScheduleResponse], { nullable: true })
  monday?: ScheduleResponse[];

  @Field(() => [ScheduleResponse], { nullable: true })
  tuesday?: ScheduleResponse[];

  @Field(() => [ScheduleResponse], { nullable: true })
  wednesday?: ScheduleResponse[];

  @Field(() => [ScheduleResponse], { nullable: true })
  thursday?: ScheduleResponse[];

  @Field(() => [ScheduleResponse], { nullable: true })
  friday?: ScheduleResponse[];

  @Field(() => [ScheduleResponse], { nullable: true })
  saturday?: ScheduleResponse[];
}
