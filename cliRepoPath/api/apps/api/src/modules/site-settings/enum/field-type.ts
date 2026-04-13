import { registerEnumType } from '@nestjs/graphql';

/**
 * Enum representing different types of form fields available in the site settings.
 *
 * @export
 * @enum {string}
 */
export enum FieldType {
  CHECKBOX = 'Checkbox',
  SELECTBOX = 'Selectbox',
  TEXTAREA = 'Textarea',
  INPUT = 'Input',
  RADIO = 'Radio',
  SWITCH = 'Switch',
  // Other possible field types can be added here
}

/**
 * Registers the FieldType enum with GraphQL so it can be used in the GraphQL schema.
 */
registerEnumType(FieldType, { name: 'FieldType' });
