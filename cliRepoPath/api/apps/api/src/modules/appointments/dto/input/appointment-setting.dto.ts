import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetAppointmentSettingDTO {
  @Field()
  getArchiveDate: boolean;
}

@InputType()
export class GetAppointmentSettingForIFrameDTO extends GetAppointmentSettingDTO {
  @IsMongoId()
  @Field()
  businessId: string;
}
