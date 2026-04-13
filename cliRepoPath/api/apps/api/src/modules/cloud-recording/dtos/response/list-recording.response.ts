import { BasePaginationResponse } from '@app/common/dto/response/base-pagination.response';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RecordingList  {
  @Field({ nullable: true })
  fileName: string;

  @Field()
  startTime: Date;

  @Field()
  appointmentId: number;

}

@ObjectType()
export class RecordingListResponse {
  @Field({ nullable: true })
  message: string;

  @Field(() => [RecordingList], { defaultValue: [] })
  data: RecordingList[];

  @Field()
  pagination: BasePaginationResponse;
}
