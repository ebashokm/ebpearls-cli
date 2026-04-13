import { toMongoObjectId } from '@app/common/helpers/mongo-helper';
import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { AdminStatusDto } from './admin-status.dto';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateAdminStatusInput
 * @typedef {UpdateAdminStatusInput}
 */
@InputType()
export class UpdateAdminStatusInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  @Transform(toMongoObjectId)
  id: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {AdminStatusDto}
   */
  @Field(() => AdminStatusDto)
  @IsNotEmpty()
  status: AdminStatusDto;
}
