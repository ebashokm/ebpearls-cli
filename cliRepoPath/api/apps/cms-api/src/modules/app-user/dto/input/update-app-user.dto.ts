import { InputType, PartialType } from '@nestjs/graphql';
import { CreateAppUserDTO } from './create-app-user.dto';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateAppUserDTO
 * @typedef {UpdateAppUserDTO}
 * @extends {PartialType(CreateAppUserDTO)}
 */
@InputType()
export class UpdateAppUserDTO extends PartialType(CreateAppUserDTO) {}
