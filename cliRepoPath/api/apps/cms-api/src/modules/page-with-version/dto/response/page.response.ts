import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@app/common/dto/response/base-response.dto';
import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { PageStatusWithVersion } from '@app/data-access/pageWithVersion/pageWithVersion.enum';
import { PageWithVersionSeoTags } from './seotags.response';

@ObjectType()
export class PageWithVersion extends BaseEntityResponse {
  /**
   * The display title of the page.
   * Used as the main heading or identifier.
   */
  //@Field(() => PageTitle)
  @Field()
  title: string;

  /**
   * The URL-friendly identifier for the page.
   * Example: "about-us" or "contact".
   */
  @Field()
  slug: string;

  /**
   * The main content body of the page.
   * Usually contains HTML or Markdown text.
   */
  @Field()
  content: string;

  /**
   * The publishing status of the page with versioning.
   * Indicates if the page is draft, published, archived, etc.
   */
  @Field(() => PageStatusWithVersion, { nullable: true })
  status: PageStatusWithVersion;

  /**
   * SEO metadata for the page.
   * Includes meta title, description, and keywords.
   */
  @Field(() => PageWithVersionSeoTags)
  seoTags: PageWithVersionSeoTags;

  /**
   * Defines the type of page (e.g., "landing", "blog", "product").
   */
  @Field()
  pageType: string;

  /**
   * The version identifier of the page.
   * Useful for rollback, comparison, and version history.
   */
  @Field({ nullable: true })
  version: string;
}

@ObjectType()
export class PageWithVersionResponse extends BaseResponse {
  /**
   * The list of pages returned in the response.
   */
  @Field(() => [PageWithVersion], { nullable: true })
  data: PageWithVersion[];
}
