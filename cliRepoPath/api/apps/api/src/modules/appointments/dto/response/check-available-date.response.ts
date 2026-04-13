import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CheckAvailableDateResponse {
  @Field({
    defaultValue: false,
  })
  success: boolean;

  @Field({
    nullable: true,
  })
  message: string;
}
