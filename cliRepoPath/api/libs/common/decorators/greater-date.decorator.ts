import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsGreaterThanDate(comparingField: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsGreaterThanDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const relatedValue = args.object as any;
          if (typeof relatedValue?.[comparingField] === 'undefined') {
            return false;
          }
          const comparingFieldDate = relatedValue?.[comparingField]
            ? new Date(relatedValue?.[comparingField])
            : null;
          const valueDate = value ? new Date(value) : null;
          if (comparingFieldDate && valueDate) {
            if (valueDate.getTime() > comparingFieldDate.getTime()) {
              return true;
            }
            return false;
          }

          return false;
        },
        defaultMessage(validationArguments) {
          const relatedValue = validationArguments.object as any;
          if (typeof relatedValue?.[comparingField] === 'undefined') {
            return `${comparingField} is invalid`;
          }
          return (
            (validationOptions?.message as string) ||
            `${validationArguments.property} should be greater than ${comparingField}`
          );
        },
      },
    });
  };
}
