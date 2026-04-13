import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateAdminDTO } from '../../../auth/dto/input/create-admin.dto';
import { AdminStatusDto } from './admin-status.dto';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateAdminDTO
 * @typedef {UpdateAdminDTO}
 * @extends {PartialType(
 *   OmitType(CreateAdminDTO, ['email'] as const),
 * )}
 */
@InputType()
export class UpdateAdminDTO extends PartialType(OmitType(CreateAdminDTO, ['email'] as const)) {
  @Field(() => AdminStatusDto, {
    nullable: true,
  })
  status?: AdminStatusDto;
}
