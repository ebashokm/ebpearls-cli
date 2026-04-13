import { registerEnumType } from '@nestjs/graphql';

export enum IAPEnvType {
  SANDBOX = 'sandbox',
  LIVE = 'live',
}

registerEnumType(IAPEnvType, {
  name: 'IAPEnvType',
});
