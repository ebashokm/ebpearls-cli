import { Field, InputType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GetHomePageTemplateDto
 * @typedef {GetHomePageTemplateDto}
 */
@InputType()
export class GetHomePageTemplateDto {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true, defaultValue: '' })
  searchText?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true, defaultValue: '_id' })
  orderBy?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true, defaultValue: 'asc' })
  order?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?number}
   */
  @Field({ defaultValue: 5 })
  limit?: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {?number}
   */
  @Field({ defaultValue: 0 })
  skip?: number;
}
