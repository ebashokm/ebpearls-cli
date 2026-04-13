import { BasePaginationParams } from '@api/common/dto/base-pagination.dto';
import { InputType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GetFAQDto
 * @typedef {GetFAQDto}
 * @extends {BasePaginationParams}
 */
@InputType()
export class GetFAQDto extends BasePaginationParams {}
