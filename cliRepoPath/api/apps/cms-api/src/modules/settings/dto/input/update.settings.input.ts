import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class OptionsInput {
  @Field({ nullable: true })
  label: string;

  @Field({ nullable: true })
  value: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SettingsUpdate
 * @typedef {SettingsUpdate}
 */
@InputType()
export class SettingsUpdate {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => ID)
  _id: string;

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
   * @type {?string[]}
   */
  @Field(() => [OptionsInput], { nullable: true })
  options?: OptionsInput[];

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

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field(() => Date)
  createdAt: Date;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field(() => Date)
  updatedAt: Date;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateSettingsDto
 * @typedef {UpdateSettingsDto}
 */
@InputType()
export class UpdateSettingsDto {
  /**
   * ${1:Description placeholder}
   *
   * @type {SettingsUpdate[]}
   */
  @Field(() => [SettingsUpdate])
  input: SettingsUpdate[];
}
