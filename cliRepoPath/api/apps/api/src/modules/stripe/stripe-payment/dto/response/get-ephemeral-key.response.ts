import { Field, ObjectType } from '@nestjs/graphql';
import { MessageResponse } from '@app/common/dto/response/message.response';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class EphemeralKey
 * @typedef {EphemeralKey}
 */
@ObjectType()
export class EphemeralKey {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  keyId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  keySecret: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field()
  createdAt: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field()
  expiresAt: number;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class EphemeralKeyResponse
 * @typedef {EphemeralKeyResponse}
 * @extends {MessageResponse}
 */
@ObjectType()
export class EphemeralKeyResponse extends MessageResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {EphemeralKey}
   */
  @Field(() => EphemeralKey)
  data: EphemeralKey;
}
