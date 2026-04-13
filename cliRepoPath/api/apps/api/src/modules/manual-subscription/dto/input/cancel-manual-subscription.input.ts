import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CancelSubscriptionInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  subscriptionId: string;

  @Field({ nullable: true })
  @IsOptional()
  cancelAtPeriodEnd?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  cancellationReason?: string;
}
