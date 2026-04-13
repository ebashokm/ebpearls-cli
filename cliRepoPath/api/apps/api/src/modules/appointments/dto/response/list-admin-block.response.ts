import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationResponse } from './list-appointment-type.response';

@ObjectType()
export class AdminBlockResponse {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Number)
  duration: number;

  @Field(() => String)
  color: string;

  @Field(() => Boolean)
  reducesUtilisation: boolean;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => String)
  businessId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class AdminBlockListResponse {
  @Field(() => [AdminBlockResponse])
  data: AdminBlockResponse[];

  @Field(() => PaginationResponse)
  pagination: PaginationResponse;
}
