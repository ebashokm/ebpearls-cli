import { SignedUrlMethod } from '@app/common/enum/signed-url.enum';
import { Field, InputType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PreSignedUrlInput
 * @typedef {PreSignedUrlInput}
 */
@InputType()
export class PreSignedUrlInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  path?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {SignedUrlMethod}
   */
  @Field(() => SignedUrlMethod)
  method: SignedUrlMethod;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  contentType?: string;
}
