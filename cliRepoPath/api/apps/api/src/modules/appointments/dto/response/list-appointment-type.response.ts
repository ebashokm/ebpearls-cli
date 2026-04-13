import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationResponse {
  @Field()
  total: number;

  @Field()
  hasNextPage: boolean;
}

@ObjectType()
export class AppointmentTypesResponse {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  color: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  duration: string;

  @Field({ nullable: true })
  status: string;

  @Field(() => [ID])
  practitioner: string[];

  @Field(() => Boolean, { nullable: true })
  multiPractitioner: boolean;

  @Field(() => Boolean, { nullable: true })
  multiPatient: boolean;

  @Field(() => Boolean, { nullable: true })
  trackTreatmentNotes: boolean;

  @Field({ nullable: true })
  businessId: string;

  @Field({ nullable: true })
  categoryName: string;

  @Field(() => Date, { nullable: true })
  createdAt: Date;
}
@ObjectType()
export class ListAppointmentTypeResponse {
  @Field(() => [AppointmentTypesResponse])
  data: AppointmentTypesResponse[];

  @Field()
  pagination: PaginationResponse;
}
