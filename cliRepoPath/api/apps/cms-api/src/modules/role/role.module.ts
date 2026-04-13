import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleService } from './role.service';
import { Role, RoleRepository, RoleSchema } from '@app/data-access/roles';
import { RoleResolver } from './role.resolver';

/**
 * Description placeholder
 *
 * @export
 * @class RoleModule
 * @typedef {RoleModule}
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  providers: [RoleResolver, RoleService, RoleRepository],
})
export class RoleModule {}
