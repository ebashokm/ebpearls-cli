import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class PauseManualSubscriptionInput {
  @Field()
  @IsNotEmpty()
  @IsMongoId()
  subscriptionId: string;

  @Field({ nullable: true })
  @IsOptional()
  resumeAt?: string;
}
