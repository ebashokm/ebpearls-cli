import { CancelClassOption } from '@app/common/enum/appointment.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class AppointmentInstanceDetailDTO {
  @Field(() => String)
  @IsNotEmpty()
  @IsMongoId()
  instanceId: string;
}

@InputType()
export class CancelAppointmentInstanceDTO extends AppointmentInstanceDetailDTO {
  @Field({ nullable: true })
  notifyAll: boolean;

  @Field({ nullable: true, defaultValue: false })
  cancelReason: string;

  @Field({ nullable: true, defaultValue: false })
  cancelNote: string;

  @Field(() => String, { nullable: true })
  @IsEnum(CancelClassOption)
  option: CancelClassOption;

  @Field(() => Boolean)
  @IsNotEmpty()
  deductCancellationcharge: boolean;
}

@InputType()
export class GetAllClientFutureBookingsForAnAppointmentDTO {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsMongoId()
  clientId: string;
  //in case of an unavailable block

  @Field(() => String)
  @IsNotEmpty()
  @IsMongoId()
  businessId: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsMongoId()
  appointmentId: string;

  @Field(() => Date)
  @IsNotEmpty()
  appointmentStartDate: Date;
}
