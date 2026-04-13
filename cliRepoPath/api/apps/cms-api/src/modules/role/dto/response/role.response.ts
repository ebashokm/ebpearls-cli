import { BaseResponse } from '@app/common/dto/response/base-response.dto';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Description placeholder
 *
 * @export
 * @class Role
 * @typedef {Role}
 */
@ObjectType()
export class Role {
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
   * @type {string}
   */
  @Field()
  description: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  slug: string;

  /**
   * Description placeholder
   *
   * @type {string[]}
   */
  @Field(() => [String])
  permissions: string[];

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field(() => Date, { nullable: true })
  createdAt: Date;
  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}

/**
 * Description placeholder
 *
 * @export
 * @class RoleResponse
 * @typedef {RoleResponse}
 * @extends {BaseResponse}
 */
@ObjectType()
export class RoleResponse extends BaseResponse {
  /**
   * Description placeholder
   *
   * @type {?Role}
   */
  @Field(() => Role, { nullable: true })
  role?: Role;

  /**
   * Description placeholder
   *
   * @type {?[Role]}
   */
  @Field(() => [Role])
  roles?: [Role];
}
