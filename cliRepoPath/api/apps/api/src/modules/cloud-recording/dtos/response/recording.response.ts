import { Field, ObjectType } from '@nestjs/graphql';
import { MessageResponse } from '@app/common/dto/response/message.response';

@ObjectType()
export class RecordingResponseField {
  @Field()
  cname: string;

  @Field()
  sid: string;

  @Field()
  uid: string;

  @Field()
  message: string;
}

@ObjectType()
export class RecordingResponse extends MessageResponse {
  @Field(() => RecordingResponseField, { nullable: true })
  data: RecordingResponseField;
}
