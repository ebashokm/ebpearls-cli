import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePaypalInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
