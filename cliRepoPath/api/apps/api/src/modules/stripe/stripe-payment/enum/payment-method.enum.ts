import { registerEnumType } from '@nestjs/graphql';

export enum PaymentMethodType {
  card = 'card',
  bank_account = 'bank_account',
}

export enum AccountHolderType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

export enum AccountType {
  CHECKING = 'checking',
  FUTSU = 'futsu',
  SAVING = 'savings',
  TOZA = 'toza',
}

registerEnumType(PaymentMethodType, {
  name: 'PaymentMethodType',
});

registerEnumType(AccountHolderType, {
  name: 'AccountHolderType',
});

registerEnumType(AccountType, {
  name: 'AccountType',
});
