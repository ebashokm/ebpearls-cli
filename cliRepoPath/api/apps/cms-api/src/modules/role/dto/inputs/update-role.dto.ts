import { InputType, PartialType } from '@nestjs/graphql';
import { CreateRoleDto } from './create-role.dto';

/**
 * Description placeholder
 *
 * @export
 * @class UpdateRoleDto
 * @typedef {UpdateRoleDto}
 * @extends {PartialType(CreateRoleDto)}
 */
@InputType()
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
