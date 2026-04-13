import { toMongoObjectId } from '@app/common/helpers/mongo-helper';
import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GetCoinPackageInput
 * @typedef {GetCoinPackageInput}
 */
@InputType()
export class GetCoinPackageInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  @Transform(toMongoObjectId)
  id: string;
}
