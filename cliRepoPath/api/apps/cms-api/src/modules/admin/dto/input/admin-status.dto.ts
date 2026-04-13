import { registerEnumType } from '@nestjs/graphql';

export enum AdminStatusDto {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

registerEnumType(AdminStatusDto, {
  name: 'AdminStatusDto',
});
