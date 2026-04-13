import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PreSignedUrlResponse
 * @typedef {PreSignedUrlResponse}
 */
@ObjectType()
export class PreSignedUrlResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  url: string;
}
