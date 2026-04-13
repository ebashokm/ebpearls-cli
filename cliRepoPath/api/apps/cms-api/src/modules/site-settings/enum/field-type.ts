import { registerEnumType } from '@nestjs/graphql';

export enum FieldType {
  CHECKBOX = 'Checkbox',
  SELECTBOX = 'Selectbox',
  TEXTAREA = 'Textarea',
  INPUT = 'Input',
  RADIO = 'Radio',
  SWITCH = 'Switch',
  // other titles
}
registerEnumType(FieldType, { name: 'FieldType' });
