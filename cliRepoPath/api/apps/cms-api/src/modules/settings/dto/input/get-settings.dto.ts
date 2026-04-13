import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GetSettingsDTO
 * @typedef {GetSettingsDTO}
 */
@InputType()
export class GetSettingsDTO {
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
  @Field({ defaultValue: 'dsc' })
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
