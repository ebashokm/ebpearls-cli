import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class TokenType
 * @typedef {TokenType}
 */
@ObjectType()
export class TokenType {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => String)
  accessToken: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field(() => Date)
  accessTokenExpiresIn: Date;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => String)
  refreshToken: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field(() => Date)
  refreshTokenExpiresIn: Date;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class TokenResponse
 * @typedef {TokenResponse}
 */
export class TokenResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  message: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  token: string;
}
