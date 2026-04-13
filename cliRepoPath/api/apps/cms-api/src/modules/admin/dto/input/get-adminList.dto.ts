import { BasePaginationParams } from '@app/common/dto/input/base-pagination.dto';
import { InputType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GetAdminListDTO
 * @typedef {GetAdminListDTO}
 * @extends {BasePaginationParams}
 */
@InputType()
export class GetAdminListDTO extends BasePaginationParams {}
