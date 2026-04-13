import { BasePaginationParams } from '@app/common/dto/input/base-pagination.dto';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class GetAnimalsInput extends BasePaginationParams {}

@InputType()
export class AnimalAddressInput {
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
export class CreateAnimalInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  species: string;

  @Field(() => Int)
  age: number;

  @Field(() => AnimalAddressInput, { nullable: true })
  address?: AnimalAddressInput;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field(() => Int, { nullable: true })
  weight?: number;

  @Field(() => Int, { nullable: true })
  height?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  gender?: string;

  @Field(() => [String], { nullable: true })
  foods?: string[];

  @Field(() => Boolean, { nullable: true })
  isVaccinated?: boolean;

  @Field(() => Boolean, { nullable: true })
  isNeutered?: boolean;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

@InputType()
export class UpdateAnimalInput extends CreateAnimalInput {
  @Field()
  @IsString()
  _id: string;
}
