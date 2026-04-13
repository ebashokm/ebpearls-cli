import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaypalSubscriptionResponse {
  @Field()
  id: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  planId: string;
}
