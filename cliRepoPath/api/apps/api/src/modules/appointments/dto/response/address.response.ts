import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AddressType } from './appointment-list.response';
import { TimezoneType } from './timezone-type';

@ObjectType()
export class LocationObjectType {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => AddressType, { nullable: true })
  locationAddress: AddressType;

  @Field(() => Boolean, { nullable: true })
  isPrimary: boolean;

  @Field(() => ID, { nullable: true })
  _id: string;

  @Field(() => String, { nullable: true })
  locationTimezone: string;

  @Field(() => TimezoneType, { nullable: true })
  locationTimezoneInfo: TimezoneType;

  @Field(() => [String], { nullable: true })
  types: string[];
}

@ObjectType()
export class ListBusinessLocationResponse {
  @Field(() => [LocationObjectType], { nullable: true })
  locations: LocationObjectType[];
}
