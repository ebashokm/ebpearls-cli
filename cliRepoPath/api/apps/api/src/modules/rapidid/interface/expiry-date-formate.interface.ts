import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MedicareCardType } from '../enums/docs-verification.enum';

interface MedicareVerificationInput {
  CardType: MedicareCardType;
}

@ValidatorConstraint({ name: 'cardExpiryFormat', async: false })
export class CardExpiryFormatConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const { object } = args;
    const inputObject = object as MedicareVerificationInput; // Cast object to MedicareVerificationInput
    if (inputObject.CardType === MedicareCardType.Green) {
      return /^(?:20)\d{2}-(?:0[1-9]|1[0-2])$/.test(value);
    } else {
      return /^(?:20)\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/.test(value);
    }
  }

  defaultMessage(args: ValidationArguments) {
    const { object } = args;
    const inputObject = object as MedicareVerificationInput; // Cast object to MedicareVerificationInput
    if (inputObject.CardType === MedicareCardType.Green) {
      return 'Expiry date must be in YYYY-MM format for Green card';
    } else {
      return 'Expiry date must be in YYYY-MM-DD format for non-Green card';
    }
  }
}

export function CardExpiryFormat(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CardExpiryFormatConstraint,
    });
  };
}
