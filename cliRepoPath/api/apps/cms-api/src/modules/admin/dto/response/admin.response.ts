import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { AdminStatus } from '@app/data-access/admin/admin-status.enum';
import { Permission } from '@cms-api/modules/permission/dto/response/permission.response';
import { Role } from '@cms-api/modules/role/dto/response/role.response';
import { ObjectType, Field } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AdminType
 * @typedef {AdminType}
 * @extends {BaseEntityResponse}
 */
@ObjectType()
export class AdminType extends BaseEntityResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => String, { nullable: true })
  firstName: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => String, { nullable: true })
  lastName: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => String)
  email: string;

  @Field()
  isSuperAdmin?: boolean;

  @Field(() => [String], { nullable: true })
  roles?: string[];

  @Field(() => [Role], { nullable: true })
  roleDetails?: Partial<Role>[];

  @Field(() => [Permission], { nullable: true })
  permissions?: Permission[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?AdminStatus}
   */
  @Field(() => AdminStatus, { nullable: true })
  status?: AdminStatus;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field(() => String, { nullable: true })
  phone?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field(() => String, { nullable: true })
  profileImage?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field(() => String, { nullable: true })
  profileImageUrl?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?boolean}
   */
  @Field({ nullable: true })
  enabled2FA?: boolean;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PaginationType
 * @typedef {PaginationType}
 */
@ObjectType()
export class PaginationType {
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field()
  total: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {boolean}
   */
  @Field()
  hasNextPage: boolean;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AdminResponse
 * @typedef {AdminResponse}
 */
@ObjectType()
export class AdminResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  message?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?AdminType[]}
   */
  @Field(() => [AdminType], { nullable: true })
  adminList?: AdminType[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?PaginationType}
   */
  @Field({ nullable: true })
  pagination?: PaginationType;

  /**
   * ${1:Description placeholder}
   *
   * @type {?AdminType}
   */
  @Field(() => AdminType, { nullable: true })
  admin?: AdminType;
}
