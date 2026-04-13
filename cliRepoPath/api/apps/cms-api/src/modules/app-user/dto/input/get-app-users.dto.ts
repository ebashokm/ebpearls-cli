import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsPositive, IsString, Min } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GetAppUsersDTO
 * @typedef {GetAppUsersDTO}
 */
@InputType()
export class GetAppUsersDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @IsString()
  @Field({ nullable: true, defaultValue: '' })
  searchText?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @IsString()
  @Field({ nullable: true, defaultValue: '_id' })
  orderBy?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @IsString()
  @Field({ nullable: true, defaultValue: 'asc' })
  order?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?number}
   */
  @IsPositive()
  @IsNumber()
  @Field({ defaultValue: 5 })
  limit?: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {?number}
   */
  @Min(0)
  @IsNumber()
  @Field({ defaultValue: 0 })
  skip?: number;
}
