import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { BillingCycle } from '@app/common/enum/billing-cycle.enum';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

@InputType()
export class CreateSubscriptionPlanInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  slug: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @Field({ nullable: true, defaultValue: 'AUD' })
  @IsOptional()
  currency?: string;

  @Field(() => BillingCycle)
  @IsEnum(BillingCycle)
  @IsNotEmpty()
  interval: BillingCycle;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  trialDays?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  features?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
