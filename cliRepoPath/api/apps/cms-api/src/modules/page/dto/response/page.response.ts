import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@app/common/dto/response/base-response.dto';
import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { PageStatus } from '../../enum/page-status.enum';
import { SeoTags } from './seotags.response';

@ObjectType()
export class Page extends BaseEntityResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  //@Field(() => PageTitle)
  @Field()
  title: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  slug: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  content: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */

  /**
   * ${1:Description placeholder}
   *
   * @type {CmsPageStatus}
   */
  @Field(() => PageStatus, { nullable: true })
  status: PageStatus;

  /**
   * ${1:Description placeholder}
   *
   * @type {SeoTags}
   */
  @Field(() => SeoTags, { nullable: true })
  seoTags: SeoTags;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  pageType: string;
}

@ObjectType()
export class PageResponse extends BaseResponse {
  @Field(() => [Page], { nullable: true })
  data: Page[];
}
