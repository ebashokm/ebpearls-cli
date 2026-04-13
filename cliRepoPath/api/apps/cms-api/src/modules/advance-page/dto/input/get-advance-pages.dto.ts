import { AdvancePageStatus } from '@app/data-access/advance-page/advance-page-status.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GetPagesDTO
 * @typedef {GetPagesDTO}
 */
@InputType()
export class GetAdvancePagesDTO {
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

  /**
   * ${1:Description placeholder}
   *
   * @type {?PageStatus}
   */
  @IsOptional()
  @Field(() => AdvancePageStatus, { nullable: true })
  status?: AdvancePageStatus;
}

@InputType()
export class GetAllAdvancePagesDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {?PageStatus}
   */
  @Field(() => AdvancePageStatus, { nullable: true })
  @IsOptional()
  status?: AdvancePageStatus;
}
