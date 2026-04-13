import { registerEnumType } from '@nestjs/graphql';

export enum PageStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

registerEnumType(PageStatus, { name: 'PageStatus' });
