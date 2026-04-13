import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ChangePasswordResponse
 * @typedef {ChangePasswordResponse}
 */
@ObjectType()
export class ChangePasswordResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  message: string;
}
