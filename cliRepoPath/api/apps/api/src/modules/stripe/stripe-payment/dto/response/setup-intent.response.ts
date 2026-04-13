import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SetupIntentResponse {
  @Field()
  clientSecret: string;
}
