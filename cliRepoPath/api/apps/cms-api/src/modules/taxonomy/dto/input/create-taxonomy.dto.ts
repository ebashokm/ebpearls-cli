import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateTaxonomyDTO
 * @typedef {CreateTaxonomyDTO}
 */
@InputType()
export class CreateTaxonomyDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {CreateTaxonDTO[]}
   */
  @IsOptional()
  @Field(() => [CreateTaxonDTO], { nullable: true })
  taxons: CreateTaxonDTO[];
}

@InputType()
class File1 {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  name: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  objectKey: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  contentType: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateTaxonDTO
 * @typedef {CreateTaxonDTO}
 */
@InputType()
export class CreateTaxonDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @Field()
  slug: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @Field()
  uuid: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {File1}
   */
  @IsOptional()
  @Field({ nullable: true })
  image: File1;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  metaTitle: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  metaDescription: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  metaKeywords: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  nestedUnder: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  description: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {CreateTaxonDTO[]}
   */
  @IsOptional()
  @Field(() => [CreateTaxonDTO], { nullable: true })
  children: CreateTaxonDTO[];
}
