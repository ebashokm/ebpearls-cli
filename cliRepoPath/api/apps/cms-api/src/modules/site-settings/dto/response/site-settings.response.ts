import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OptionsResponse {
  @Field({ nullable: true })
  label: string;

  @Field({ nullable: true })
  value: string;
}

@ObjectType()
export class SiteSettingsResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  _id: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  userId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  title: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  description: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  key: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  fieldType: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => [String], { nullable: true })
  value: string[];

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => [OptionsResponse], { nullable: true })
  options: OptionsResponse[];
}
