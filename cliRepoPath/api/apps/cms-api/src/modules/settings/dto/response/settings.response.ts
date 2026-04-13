import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OptionsData {
  @Field({ nullable: true })
  value: string;

  @Field({ nullable: true })
  label: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class Settings
 * @typedef {Settings}
 * @extends {BaseEntityResponse}
 */
@ObjectType()
export class Settings extends BaseEntityResponse {
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
  fieldType: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field({ nullable: true })
  order: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => [OptionsData], { nullable: true })
  options: OptionsData[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  value?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string[]}
   */
  @Field(() => [String], { nullable: true })
  values?: string[];
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SettingsResponse
 * @typedef {SettingsResponse}
 */
@ObjectType()
export class SettingsResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  message?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?Settings}
   */
  @Field(() => [Settings], { nullable: true })
  settings?: Settings;

  /**
   * ${1:Description placeholder}
   *
   * @type {?Settings}
   */
  @Field(() => Settings, { nullable: true })
  setting?: Settings;
}
