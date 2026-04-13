import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreatePaypalOrderResponse {
  @Field()
  link: string;
}

@ObjectType()
export class CapturePaypalOrderResponse {
  @Field()
  id: string;

  @Field()
  status: string;
}
