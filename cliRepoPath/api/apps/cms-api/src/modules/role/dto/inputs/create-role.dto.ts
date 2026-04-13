import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, MaxLength } from 'class-validator';

/**
 * DTO for creating a Role with permissions.
 *
 * @export
 * @class CreateRoleDto
 */
@InputType()
export class CreateRoleDto {
  /**
   * The name of the role.
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty({ message: 'Role name must not be empty' })
  @MaxLength(100, { message: 'Role name must not exceed 100 characters' })
  name: string;

  /**
   * The name of the slug.
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty({ message: 'Slug must not be empty' })
  @MaxLength(100, { message: 'Slug must not exceed 100 characters' })
  slug: string;

  @Field()
  @IsNotEmpty({ message: '' })
  @MaxLength(100, { message: 'Description must not exceed 100 characters' })
  description: string;

  /**
   * Permissions assigned to the role.
   *
   * @type {string[]}
   */
  @Field(() => [String], { nullable: true })
  @Type(() => String)
  permissions?: string[];
}

@InputType()
export class UpdateRolePermissionDto {
  /**
   * Permissions assigned to the role.
   *
   * @type {string[]}
   */
  @Field(() => [String])
  @IsNotEmpty({ each: true, message: 'Each permission must not be empty' })
  @Type(() => String)
  permissions: string[];
}

@InputType()
export class RolePermissionsInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Role name must not be empty' })
  @Type(() => String)
  role: string;

  @Field(() => [String])
  @IsArray()
  @IsNotEmpty({ each: true, message: 'Each permission must not be empty' })
  @Type(() => String)
  permissions: string[];
}

@InputType()
export class UpdateRolesPermissionDto {
  /**
   * Permissions assigned to the role.
   *
   * @type {string[]}
   */
  @Field(() => [RolePermissionsInput])
  @IsNotEmpty({ each: true, message: 'Each role must not be empty' })
  @Type(() => String)
  rolesPermissions: RolePermissionsInput[];
}
