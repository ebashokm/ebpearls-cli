import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../roles';
import { PermissionRepository } from './permission.repository';
import { toMongoId } from '@app/common/helpers/mongo-helper';
import { RoleSlugs } from '../roles/role-slugs';
import { PermissionSlug } from './permission-slugs';

@Injectable()
export class PermissionHelperSerivce {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async hasPermission(roleIds: string[], requiredPermissions: (PermissionSlug | (string & {}))[]) {
    const roles = await this.roleRepository.find({
      _id: { $in: roleIds.map((id) => toMongoId(id)) },
    });
    const rolesSlug = roles.map((role) => role.slug);
    if (rolesSlug.includes(RoleSlugs.SUPER_ADMIN)) {
      return true;
    }

    const permissionsIds = roles.flatMap((role) => role.permissions);
    const permissions = await this.permissionRepository.find({ _id: { $in: permissionsIds } });
    const permissionSlugs = permissions.map((permission) => permission.slug);
    const hasPermission = requiredPermissions.every((permission) =>
      permissionSlugs.includes(permission),
    );
    return hasPermission;
  }
}
