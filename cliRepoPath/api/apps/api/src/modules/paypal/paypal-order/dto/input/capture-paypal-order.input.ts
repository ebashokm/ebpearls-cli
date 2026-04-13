import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CapturePaypalOrderInput {
  @Field()
  @IsNotEmpty()
  orderId: string;
}
