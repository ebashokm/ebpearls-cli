import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsValidTimezoneRegion(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsValidTimezoneRegion',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          try {
            Intl.DateTimeFormat(undefined, { timeZone: value });
            return true;
          } catch (e) {
            return false;
          }
        },
      },
    });
  };
}
