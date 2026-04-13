import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CheckAvailableLocationResponse {
  @Field({
    defaultValue: false,
  })
  success: boolean;

  @Field({
    nullable: true,
  })
  location: string;
}
