import { registerEnumType } from '@nestjs/graphql';

export enum MedicareCardType {
  Blue = 'B',
  Yellow = 'Y',
  Green = 'G',
}

registerEnumType(MedicareCardType, {
  name: 'MedicareCardType',
});

export enum DocsVerificationGenderType {
  Male = 'M',
  Female = 'F',
  Gender_X = 'X',
}

registerEnumType(DocsVerificationGenderType, {
  name: 'DocsVerificationGenderType',
});

export enum DriverLicenceStateOfIssue {
  NSW = 'NSW',
  QLD = 'QLD',
  SA = 'SA',
  TAS = 'TAS',
  VIC = 'VIC',
  WA = 'WA',
  ACT = 'ACT',
  NT = 'NT',
}

registerEnumType(DriverLicenceStateOfIssue, {
  name: 'DriverLicenceStateOfIssue',
});
