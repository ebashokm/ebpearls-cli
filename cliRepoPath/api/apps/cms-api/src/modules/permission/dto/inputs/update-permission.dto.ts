import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePermissionDto } from './create-permission.dto';

/**
 * Description placeholder
 *
 * @export
 * @class UpdateRoleDto
 * @typedef {UpdateRoleDto}
 * @extends {PartialType(CreateRoleDto)}
 */
@InputType()
export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
