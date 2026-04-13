import { InputType, PartialType } from '@nestjs/graphql';
import { CreateMenuDTO } from './create-menu-dto';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdatePageDTO
 * @typedef {UpdatePageDTO}
 * @extends {PartialType(CreateMenuDTO)}
 */
@InputType()
export class UpdatePageDTO extends PartialType(CreateMenuDTO) {}
