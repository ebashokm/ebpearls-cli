import { BasePaginationParams } from '@api/common/dto/base-pagination.dto';
import { InputType, Field, PickType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ListNotificationsInput
 * @typedef {ListNotificationsInput}
 * @extends {PickType(BasePaginationParams, [
 *   'limit',
 *   'skip',
 * ])}
 */
@InputType()
export class ListNotificationsInput extends PickType(BasePaginationParams, [
  'limit',
  'skip',
]) {
  /**
   * ${1:Description placeholder}
   *
   * @type {?Date}
   */
  @Field({ nullable: true })
  timestamp?: Date;
}
