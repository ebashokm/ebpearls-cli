import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { ObjectType, Field } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class BusinessUser
 * @typedef {BusinessUser}
 * @extends {BaseEntityResponse}
 */
@ObjectType()
export class BusinessUser extends BaseEntityResponse {
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
  email: string;

  @Field()
  userId: string;
}
