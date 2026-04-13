import { BaseResponse } from '@app/common/dto/response/base-response.dto';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @class Taxonomy
 * @typedef {Taxonomy}
 */
@ObjectType()
class Taxonomy {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  _id: string;
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
   * @type {?[Taxon]}
   */
  @Field(() => [Taxon], { nullable: true })
  taxons?: [Taxon];

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field({ nullable: true })
  createdAt: Date;
  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field({ nullable: true })
  updatedAt: Date;
}

/**
 * ${1:Description placeholder}
 *
 * @class FileResponse1
 * @typedef {FileResponse1}
 */
@ObjectType()
class FileResponse1 {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  name: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  objectKey: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  contentType: string;
}

/**
 * ${1:Description placeholder}
 *
 * @class Taxon
 * @typedef {Taxon}
 */
@ObjectType()
class Taxon {
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
  slug: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  metaTitle?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  uuid: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  metaDescription?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?FileResponse1}
   */
  @Field({ nullable: true })
  image?: FileResponse1;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  metaKeywords?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  description?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @IsOptional()
  @Field({ nullable: true })
  nestedUnder?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?[Taxon]}
   */
  @Field(() => [Taxon], { nullable: true })
  children?: [Taxon];
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class TaxonomyResponse
 * @typedef {TaxonomyResponse}
 * @extends {BaseResponse}
 */
@ObjectType()
export class TaxonomyResponse extends BaseResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {Taxonomy}
   */
  @Field(() => Taxonomy, { nullable: false })
  taxonomy: Taxonomy;

  /**
   * ${1:Description placeholder}
   *
   * @type {[Taxonomy]}
   */
  @Field(() => [Taxonomy], { nullable: true })
  taxonomies: [Taxonomy];
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class TaxonResponse
 * @typedef {TaxonResponse}
 * @extends {BaseResponse}
 */
@ObjectType()
export class TaxonResponse extends BaseResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {Taxon}
   */
  @Field(() => Taxon, { nullable: false })
  taxon: Taxon;

  /**
   * ${1:Description placeholder}
   *
   * @type {[Taxon]}
   */
  @Field(() => [Taxon], { nullable: true })
  taxons: [Taxon];
}
