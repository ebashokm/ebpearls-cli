import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function medicareCardFormat(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'medicareCardFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string' || value.length !== 10) {
            return false;
          }
          return value === value.toUpperCase();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be exactly 10 characters long and all uppercase`;
        },
      },
    });
  };
}
