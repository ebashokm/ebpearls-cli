import { BasePaginationParams } from '@app/common/dto/input/base-pagination.dto';
import { Field, InputType, Int, Float, PartialType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

@InputType()
export class FakeManufacturerAddressInput {
  @Field()
  @IsString()
  city: string;

  @Field()
  @IsString()
  state: string;

  @Field()
  @IsString()
  street: string;

  @Field()
  @IsString()
  zip: string;
}

@InputType()
export class GetFakeProductsInput extends BasePaginationParams {
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => Float, {
    nullable: true,
    description: 'Price must be greater than this value (non-inclusive)',
  })
  minPrice?: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Price must be less than this value (non-inclusive)',
  })
  maxPrice?: number;

  @Field(() => [String], { nullable: true, description: 'Filter by one or more tag IDs' })
  tags?: string[];
}

@InputType()
export class FakeProductDimensionsInput {
  @Field(() => Int)
  width: number;

  @Field(() => Int)
  height: number;

  @Field(() => Int)
  depth: number;

  @Field()
  @IsString()
  unit: string;
}

@InputType()
export class FakeProductCategoryInput {
  @Field({ nullable: true })
  @IsString()
  _id: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  slug: string;
}

@InputType()
export class CreateFakeProductInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field()
  @IsString()
  sku: string;

  @Field(() => Float)
  @IsNumber()
  price: number;

  @Field(() => Int)
  @IsNumber()
  stock: number;

  // This expects the S3 Key (e.g. "01e1f1e-1e1f-1e1f-1e1f-1e1f1e1f1e1f.png") or a full URL
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  image?: string;

  @Field(() => FakeProductDimensionsInput, { nullable: true })
  dimensions?: FakeProductDimensionsInput;

  @Field(() => FakeProductCategoryInput, { nullable: true })
  category?: FakeProductCategoryInput;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => FakeManufacturerAddressInput, { nullable: true })
  manufacturedAt?: FakeManufacturerAddressInput;
}

@InputType()
export class UpdateFakeProductInput extends PartialType(CreateFakeProductInput) {
  @Field()
  @IsString()
  _id: string;
}
