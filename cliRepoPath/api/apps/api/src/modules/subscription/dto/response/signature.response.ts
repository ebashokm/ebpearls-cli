import { ObjectType, Field, Float } from '@nestjs/graphql';
@ObjectType()
export class OfferSignatureResponse {
  @Field()
  signature: string;

  @Field()
  keyIdentifier: string;

  @Field()
  nonce: string;

  @Field(() => Float)
  timestamp: number;
}
