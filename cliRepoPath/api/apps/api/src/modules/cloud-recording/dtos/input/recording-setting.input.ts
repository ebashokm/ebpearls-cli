import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RecordingSettingInput {
  @Field({ nullable: true })
  autoRecording: boolean | null;
}
