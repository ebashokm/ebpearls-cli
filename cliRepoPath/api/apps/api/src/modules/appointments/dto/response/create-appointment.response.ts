import { AppointmentTypeObject, PractitionerType } from '@app/common/dto/response/client.response';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateAppointmentResponse {
  @Field(() => PractitionerType)
  practitioner: PractitionerType;

  @Field(() => AppointmentTypeObject)
  appointmentType: AppointmentTypeObject;

  @Field(() => Date)
  startTime: Date;

  @Field(() => Date)
  endTime: Date;

  @Field(() => String, { nullable: true })
  note: string;

  @Field(() => ID)
  createdBy: string;
}
