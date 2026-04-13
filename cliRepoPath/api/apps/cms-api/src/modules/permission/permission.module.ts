import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionService } from './permission.service';
import { Permission, PermissionRepository, PermissionSchema } from '@app/data-access/permission';
import { PermissionResolver } from './permission.resolver';
import { Role, RoleRepository, RoleSchema } from '@app/data-access';
import { PermissionModuleSchema } from '@app/data-access/permission-module/permission-module.schema';
import { PermissionModuleRepository } from '@app/data-access/permission-module';
import { PermissionHelperSerivce } from '@app/data-access/permission/permission.helper';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: PermissionModule.name, schema: PermissionModuleSchema },
    ]),
  ],
  exports: [MongooseModule, PermissionRepository, RoleRepository, PermissionHelperSerivce],
  providers: [
    PermissionResolver,
    PermissionService,
    PermissionRepository,
    RoleRepository,
    PermissionModuleRepository,
    PermissionHelperSerivce,
  ],
})
export class PermissionModule {}
