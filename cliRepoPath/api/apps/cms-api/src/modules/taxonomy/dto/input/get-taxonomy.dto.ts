import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GetTaxonsDTO
 * @typedef {GetTaxonsDTO}
 */
@InputType()
export class GetTaxonsDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @IsOptional()
  @Field({ defaultValue: '' })
  searchText?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @IsOptional()
  @Field({ defaultValue: '_id' })
  orderBy?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @IsOptional()
  @Field({ defaultValue: 'asc' })
  order?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?number}
   */
  @IsOptional()
  @Field({ defaultValue: 5 })
  limit?: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {?number}
   */
  @IsOptional()
  @Field({ defaultValue: 0 })
  skip?: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsNotEmpty()
  @Field()
  taxonomyId: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GetTaxonByTaxonomyIdDTO
 * @typedef {GetTaxonByTaxonomyIdDTO}
 */
@InputType()
export class GetTaxonByTaxonomyIdDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsNotEmpty()
  @Field()
  taxonomyId: string;
}
