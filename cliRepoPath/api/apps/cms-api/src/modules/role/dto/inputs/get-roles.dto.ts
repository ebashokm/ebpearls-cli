import { BasePaginationParams } from '@app/common/dto/input/base-pagination.dto';
import { InputType } from '@nestjs/graphql';

/**
 * Description placeholder
 *
 * @export
 * @class GetRoleDto
 * @typedef {GetRoleDto}
 * @extends {BasePaginationParams}
 */
@InputType()
export class GetRoleDto extends BasePaginationParams {}
