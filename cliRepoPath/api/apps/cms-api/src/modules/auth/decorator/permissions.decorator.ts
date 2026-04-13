import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt.authguard';
import { PermissionsGuard } from '@app/data-access/permission/permission.guard';
import { PermissionSlug } from '@app/data-access/permission/permission-slugs';

export function Permissions(...permissions: PermissionSlug[]) {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(JwtAuthGuard, PermissionsGuard),
  );
}
