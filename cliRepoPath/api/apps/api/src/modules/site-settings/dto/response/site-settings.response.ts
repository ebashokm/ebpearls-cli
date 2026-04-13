import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Response object for individual options within site settings.
 *
 * @export
 * @class OptionsResponse
 */
@ObjectType()
export class OptionsResponse {
  /**
   * The key of the option.
   *
   * @type {string}
   */
  @Field({ nullable: true })
  key: string;

  /**
   * The value associated with the option.
   *
   * @type {string}
   */
  @Field({ nullable: true })
  value: string;
}

/**
 * Response object for site settings.
 *
 * @export
 * @class SiteSettingsResponse
 */
@ObjectType()
export class SiteSettingsResponse {
  /**
   * The unique identifier of the site setting.
   *
   * @type {string}
   */
  @Field({ nullable: true })
  _id: string;

  /**
   * The ID of the user associated with the site setting.
   *
   * @type {string}
   */
  @Field({ nullable: true })
  userId: string;

  /**
   * Title of the site setting.
   *
   * @type {string}
   */
  @Field({ nullable: true })
  title: string;

  /**
   * Description of the site setting.
   *
   * @type {string}
   */
  @Field({ nullable: true })
  description: string;

  /**
   * Key for identifying the setting.
   *
   * @type {string}
   */
  @Field({ nullable: true })
  key: string;

  /**
   * Type of field for the setting (e.g., text, number).
   *
   * @type {string}
   */
  @Field({ nullable: true })
  fieldType: string;

  /**
   * Values associated with the setting.
   *
   * @type {string[]}
   */
  @Field(() => [String], { nullable: true })
  value: string[];

  /**
   * Available options for the setting (if applicable).
   *
   * @type {OptionsResponse[]}
   */
  @Field(() => [OptionsResponse], { nullable: true })
  options: OptionsResponse[];
}
