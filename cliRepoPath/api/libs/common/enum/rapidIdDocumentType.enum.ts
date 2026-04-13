import { registerEnumType } from '@nestjs/graphql';

export enum RapidIdDocumentType {
  Medicare = 'Medicare',
  Passport = 'Passport',
  DriverLicense = 'Driver License',
}

registerEnumType(RapidIdDocumentType, {
  name: 'RapidIdDocumentType',
});
