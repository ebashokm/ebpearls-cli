import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PayPalOAuthTokenResponse {
  @Field()
  accessToken: string;

  @Field()
  tokenType: string;

  @Field(() => Int)
  expiresIn: number;

  @Field()
  scope: string;

  @Field()
  idToken: string;
}
