import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from '@app/data-access/permission';
import { Role, RoleSchema } from '@app/data-access/roles';
import { PermissionRepository } from '@app/data-access/permission/permission.repository';
import { RoleRepository } from '@app/data-access/roles/role.repository';

/**
 * Description placeholder
 *
 * @export
 * @class PermissionModule
 * @typedef {PermissionModule}
 */
@Global() // Make it globally available
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  providers: [PermissionRepository, RoleRepository], // Add repositories
  exports: [MongooseModule, PermissionRepository, RoleRepository], // Export both MongooseModule and repositories
})
export class PermissionModule {}
