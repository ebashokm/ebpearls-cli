import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class StartRecordingInput {
  @Field()
  @IsNotEmpty()
  channelName: string;

  @Field({ nullable: true })
  token: string;

  @Field({ nullable: true })
  autoRecording: boolean;
}
