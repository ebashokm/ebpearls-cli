import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType()
export class ResumeManualSubscriptionInput {
  @Field()
  @IsNotEmpty()
  @IsMongoId()
  subscriptionId: string;
}
