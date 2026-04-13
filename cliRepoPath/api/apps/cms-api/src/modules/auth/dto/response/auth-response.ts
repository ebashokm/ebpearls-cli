import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { AdminType } from '../../../admin/dto/response/admin.response';
import { Settings } from '@cms-api/modules/settings/dto/response/settings.response';

/**
 * ${1:Description placeholder}
 *
 * @class BusinessUserResponse
 * @typedef {BusinessUserResponse}
 */
@ObjectType()
class BusinessUserResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  _id?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  name?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  email?: string;
}

/**
 * ${1:Description placeholder}
 *
 * @class AuthResponse
 * @typedef {AuthResponse}
 */
@ObjectType()
class AuthResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  message?: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AdminLoginResponse
 * @typedef {AdminLoginResponse}
 * @extends {AuthResponse}
 */
@ObjectType()
export class AdminLoginResponse extends AuthResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {AdminType}
   */
  @Field(() => AdminType, { nullable: true })
  admin: AdminType;

  @Field(() => [Settings], { nullable: true })
  settings?: Settings[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?BusinessUserResponse}
   */
  @Field(() => BusinessUserResponse, { nullable: true })
  user?: BusinessUserResponse;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field(() => String, { nullable: true })
  accessToken?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field(() => String, { nullable: true })
  refreshToken?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?number}
   */
  @Field({ nullable: true })
  expiresBy?: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {?Date}
   */
  @Field({ nullable: true })
  expiresAt?: Date;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ChangePasswordResponse
 * @typedef {ChangePasswordResponse}
 * @extends {AuthResponse}
 */
@ObjectType()
export class ChangePasswordResponse extends AuthResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {boolean}
   */
  @Field()
  status: boolean;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class RefreshTokenResponse
 * @typedef {RefreshTokenResponse}
 * @extends {OmitType(AdminLoginResponse, [
 *   'admin',
 * ] as const)}
 */
@ObjectType()
export class RefreshTokenResponse extends OmitType(AdminLoginResponse, ['admin'] as const) {}
