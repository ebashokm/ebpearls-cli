import { FieldType } from '../enum/field-type';

/**
 * Language options available for users to select.
 * Each option contains a key (language code) and a value (language name).
 *
 * @type {readonly [{ readonly key: "en"; readonly value: "English"; }, { readonly key: "es"; readonly value: "Spanish"; }, { readonly key: "fr"; readonly value: "French"; }, { readonly key: "de"; readonly value: "German"; }]}
 */
export const LANGUAGE_OPTIONS = [
  {
    key: 'en',
    value: 'English',
  },
  {
    key: 'es',
    value: 'Spanish',
  },
  {
    key: 'fr',
    value: 'French',
  },
  {
    key: 'de',
    value: 'German',
  },
] as const;

/**
 * Application settings configuration.
 * Each setting includes a key for identification, a default value,
 * a field type that determines how the setting will be displayed,
 * and options for select type fields.
 *
 * @type {readonly [{ readonly key: "language"; readonly value: "en"; readonly fieldType: FieldType; readonly options: readonly [{ readonly key: "en"; readonly value: "English"; }, { readonly key: "es"; readonly value: "Spanish"; }, { ...; }, { ...; }]; }, { readonly key: "darkMode"; readonly value: false; readonly fieldType: FieldType; }, { readonly key: "siteDescription"; readonly value: "This is the default site description"; readonly fieldType: FieldType; }]}
 */
export const SETTINGS = [
  {
    key: 'language',
    value: 'en',
    fieldType: FieldType.SELECTBOX, // Using the constant for select box field type
    options: LANGUAGE_OPTIONS, // Reference to available language options
  },
  {
    key: 'darkMode',
    value: false,
    fieldType: FieldType.CHECKBOX, // Using the constant for checkbox field type
  },
  {
    key: 'siteDescription',
    value: 'This is the default site description',
    fieldType: FieldType.TEXTAREA, // Using the constant for textarea field type
  },
] as const;
