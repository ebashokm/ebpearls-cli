import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GetEmailTemplateDTO
 * @typedef {GetEmailTemplateDTO}
 */
@InputType()
export class GetEmailTemplateDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true, defaultValue: '' })
  @IsOptional()
  searchText?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true, defaultValue: '_id' })
  @IsOptional()
  orderBy?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true, defaultValue: 'asc' })
  @IsOptional()
  order?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?number}
   */
  @Field({ defaultValue: 5 })
  @IsOptional()
  limit?: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {?number}
   */
  @Field({ defaultValue: 0 })
  @IsOptional()
  skip?: number;
}
