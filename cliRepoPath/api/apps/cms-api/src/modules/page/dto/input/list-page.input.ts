import { BasePaginationParams } from '@app/common/dto/input/base-pagination.dto';
import { InputType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GetAllPagesInputDTO
 * @typedef {GetAllPagesInputDTO}
 */
@InputType()
export class GetAllPagesInputDTO extends BasePaginationParams {}
