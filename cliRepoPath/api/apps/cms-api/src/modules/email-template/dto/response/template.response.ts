import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class TemplateResponse
 * @typedef {TemplateResponse}
 */
@ObjectType()
export class TemplateResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field(() => String, { nullable: true })
  template?: string;
}
