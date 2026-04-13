import { InputType, Field } from '@nestjs/graphql';

/**
 * Input type for updating site settings.
 *
 * @export
 * @class UpdateSettingInput
 */
@InputType()
export class UpdateSettingInput {
  /**
   * Key for the setting to be updated.
   *
   * @type {string}
   */
  @Field()
  key: string;

  /**
   * Value of the setting to be updated.
   *
   * @type {string}
   */
  @Field()
  value: string;
}
