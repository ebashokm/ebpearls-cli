import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Min } from 'class-validator';

@InputType()
export class CreatePaypalOrderInput {
  @Field()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @Field({ nullable: true, defaultValue: 'USD' })
  currency: string;

  @Field({ nullable: true, defaultValue: 1 })
  quantity: number;

  @Field({ nullable: true })
  itemName: string;
}
