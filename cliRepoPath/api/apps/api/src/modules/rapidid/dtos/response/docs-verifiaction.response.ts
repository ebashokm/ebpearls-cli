import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DocsVerificationResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;
}
