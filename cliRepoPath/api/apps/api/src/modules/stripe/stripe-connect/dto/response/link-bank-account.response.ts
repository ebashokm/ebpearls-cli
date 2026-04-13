import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class LinkBankAccountResponse
 * @typedef {LinkBankAccountResponse}
 */
@ObjectType()
export class LinkBankAccountResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ description: 'Gives idea what are we doing with stripe connect.' })
  object: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field({
    description: 'Time at which the object was created. Measured in seconds since the Unix epoch.',
  })
  created: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field({
    description: 'The timestamp at which this account link will expire.',
  })
  expires_at: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ description: 'The URL for the account link.' })
  url: string;
}
