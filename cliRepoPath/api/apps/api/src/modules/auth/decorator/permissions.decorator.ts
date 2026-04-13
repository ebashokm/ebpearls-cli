import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { PermissionsGuard } from '@app/data-access/permission/permission.guard';
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

export function Permissions(...permissions: string[]) {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(AuthUserGuard, PermissionsGuard),
  );
}
