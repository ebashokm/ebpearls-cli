import { BasePaginationResponse } from '@app/common/dto/response/base-pagination.response';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class FakeManufacturerAddressResponse {
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
export class FakeProductDimensionsResponse {
  @Field(() => Int)
  width: number;

  @Field(() => Int)
  height: number;

  @Field(() => Int)
  depth: number;

  @Field()
  unit: string;
}

@ObjectType()
export class FakeProductCategoryResponse {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field()
  slug: string;
}

@ObjectType()
export class FakeProductResponse {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  sku: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stock: number;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => FakeProductDimensionsResponse, { nullable: true })
  dimensions?: FakeProductDimensionsResponse;

  @Field(() => FakeProductCategoryResponse, { nullable: true })
  category?: FakeProductCategoryResponse;

  @Field(() => FakeManufacturerAddressResponse, { nullable: true })
  manufacturedAt?: FakeManufacturerAddressResponse;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@ObjectType()
export class FakeProductsListResponse {
  @Field(() => [FakeProductResponse])
  items: FakeProductResponse[];

  @Field(() => BasePaginationResponse)
  pagination: BasePaginationResponse;
}

@ObjectType()
class FakeTags {
  @Field()
  _id: string;
  @Field()
  name: string;
}

@ObjectType()
export class FakeProductTagsResponse {
  @Field(() => [FakeTags])
  tags: FakeTags[];
}
