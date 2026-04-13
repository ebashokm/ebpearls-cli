import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SeoTags {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  title: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  description: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  tags: string;
}
