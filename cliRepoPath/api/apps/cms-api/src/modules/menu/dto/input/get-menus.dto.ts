import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GetMenusDTO
 * @typedef {GetMenusDTO}
 */
@InputType()
export class GetMenusDTO {
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
  @Field({ defaultValue: 'createdAt' })
  orderBy?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @IsOptional()
  @Field({ defaultValue: 'desc' })
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
}
