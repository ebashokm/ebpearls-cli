import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateContactInput {
  @Field(() => Int)
  id: number;
}
