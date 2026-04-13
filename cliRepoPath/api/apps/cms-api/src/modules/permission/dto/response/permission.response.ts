import { BaseResponse } from '@app/common/dto/response/base-response.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Permission {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  _id: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  name: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  slug: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  description: string;

  @Field({ nullable: true })
  permissionModuleId?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field(() => Date, { nullable: true })
  createdAt: Date;
  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}

@ObjectType()
export class PermissionResponse extends BaseResponse {
  @Field(() => Permission, { nullable: true })
  permission?: Permission;

  @Field(() => [Permission])
  permissions?: [Permission];
}

@ObjectType()
export class PermissionModuleResponse extends BaseResponse {
  @Field()
  _id: string;

  @Field()
  name: string;
}

@ObjectType()
export class ListPermissionModuleResponse extends BaseResponse {
  @Field(() => [PermissionModuleResponse])
  permissionModules: PermissionModuleResponse[];
}
