import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SeoInfoInput {
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
  tags: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  description: string;
}
