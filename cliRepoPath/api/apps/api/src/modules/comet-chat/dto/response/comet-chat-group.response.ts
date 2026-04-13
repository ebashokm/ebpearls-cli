import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CometChatGroupResponse
 * @typedef {CometChatGroupResponse}
 */
@ObjectType()
export class CometChatGroupResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  guid: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  propertyId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  propertyOwnerId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  requesterId: string;
}
