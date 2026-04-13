import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Role, RoleDocument } from './role.schema';
import { RoleSlugs } from './role-slugs';

@Injectable()
export class RoleRepository extends BaseRepo<RoleDocument> {
  constructor(
    @InjectModel(Role.name)
    private readonly role: Model<RoleDocument>,
  ) {
    super(role);
  }

  async getAllRoles(filter) {
    return this.role.find({ ...filter, slug: { $ne: RoleSlugs.SUPER_ADMIN } });
  }

  async bulkUpdateRolePermission(bulkOperations: any): Promise<any> {
    return await this.role.bulkWrite(bulkOperations);
  }

  async getRolesPermissions(roles: string[]) {
    const rolesData = await this.role
      .aggregate()
      .match({ _id: { $in: roles } })
      .lookup({
        from: 'permissions',
        localField: 'permissions',
        foreignField: '_id',
        as: 'permissions',
      });
    const permissionsMap = new Map();

    rolesData.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissionsMap.set(permission._id.toString(), {
          _id: permission._id,
          slug: permission.slug,
        });
      });
    });

    return Array.from(permissionsMap.values());
  }
}
