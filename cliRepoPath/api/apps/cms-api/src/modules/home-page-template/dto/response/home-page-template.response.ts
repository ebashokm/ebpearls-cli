import { Field, ObjectType } from '@nestjs/graphql';
import { HomePageTemplate } from '../../entities/home-page-template.entity';
import { BaseResponse } from '@app/common/dto/response/base-response.dto';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class HomePageTemplateResponse
 * @typedef {HomePageTemplateResponse}
 * @extends {BaseResponse}
 */
@ObjectType()
export class HomePageTemplateResponse extends BaseResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {?HomePageTemplate[]}
   */
  @Field(() => [HomePageTemplate], { nullable: true })
  templates?: HomePageTemplate[];
  /**
   * ${1:Description placeholder}
   *
   * @type {?HomePageTemplate}
   */
  @Field(() => HomePageTemplate, { nullable: true })
  template?: HomePageTemplate;
}
