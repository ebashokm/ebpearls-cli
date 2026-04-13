import { Field, ObjectType } from '@nestjs/graphql';
import { AppUser } from '../entity/app-user.entity';
import { BaseResponse } from '@app/common/dto/response/base-response.dto';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AppUserResponse
 * @typedef {AppUserResponse}
 * @extends {BaseResponse}
 */
@ObjectType()
export class AppUserResponse extends BaseResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {?AppUser}
   */
  @Field(() => AppUser, { nullable: true })
  user?: AppUser;

  /**
   * ${1:Description placeholder}
   *
   * @type {?AppUser[]}
   */
  @Field(() => [AppUser], { nullable: true })
  users?: AppUser[];
}
