import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteSubscriptionPlanInput {
  @Field()
  @IsNotEmpty()
  @IsMongoId()
  planId: string;
}
