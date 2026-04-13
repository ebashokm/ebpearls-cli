import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageWithVersionSeoTags {
  /**
   * SEO title of the page.
   * Appears in the browser tab and search engine results.
   */
  @Field()
  title: string;

  /**
   * Meta description of the page.
   * Used by search engines to display a summary of the page.
   */
  @Field()
  description: string;

  /**
   * Comma-separated keywords or tags for SEO optimization.
   * Helps search engines understand page relevance.
   */
  @Field()
  tags: string;
}
