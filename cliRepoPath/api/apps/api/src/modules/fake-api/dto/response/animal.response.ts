import { BasePaginationResponse } from '@app/common/dto/response/base-pagination.response';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class AnimalAddressResponse {
  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  street: string;

  @Field()
  zip: string;
}

@ObjectType()
export class AnimalResponse {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field()
  species: string;

  @Field(() => Int)
  age: number;

  @Field(() => AnimalAddressResponse, { nullable: true })
  address?: AnimalAddressResponse;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  height?: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  isNeutered?: boolean;

  @Field({ nullable: true })
  isVaccinated?: boolean;

  @Field(() => [String], { nullable: true })
  foods?: string[];
}

@ObjectType()
export class AnimalsListResponse {
  @Field(() => [AnimalResponse])
  items: AnimalResponse[];

  @Field(() => BasePaginationResponse)
  pagination: BasePaginationResponse;
}
