import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TimezoneType {
  @Field({ nullable: true })
  _id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  offsetHours: number;

  @Field({ nullable: true })
  offsetMinutes: number;

  @Field({ nullable: true })
  default: boolean;

  @Field({ nullable: true })
  offsetInMinutes: number;
}
