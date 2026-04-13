import { BasePaginationParams } from '@api/common/dto/base-pagination.dto';
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ListUseProfilesDTO
 * @typedef {ListUseProfilesDTO}
 * @extends {BasePaginationParams}
 */
@InputType()
export class ListContactsDTO extends BasePaginationParams {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  deviceId: string;
}
