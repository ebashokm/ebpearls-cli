import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';

/**
 * DTO for creating a Role with permissions.
 *
 * @export
 * @class CreateRoleDto
 */
@InputType()
export class CreatePermissionDto {
  /**
   * The name of the role.
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty({ message: '' })
  @MaxLength(100, { message: 'name must not exceed 100 characters' })
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
}
