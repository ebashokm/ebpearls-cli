import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotFoundException, SetMetadata } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { RoleService } from './role.service';
import {
  CreateRoleDto,
  UpdateRolePermissionDto,
  UpdateRolesPermissionDto,
} from './dto/inputs/create-role.dto';
import { UpdateRoleDto } from './dto/inputs/update-role.dto';
import { Role, RoleResponse } from './dto/response/role.response';
import { RoleDocument } from '@app/data-access/roles';
import { Permissions } from '../auth/decorator/permissions.decorator';

/**
 * Description placeholder
 *
 * @export
 * @class RoleResolver
 * @typedef {RoleResolver}
 */
@Resolver(() => Role)
export class RoleResolver {
  /**
   * Creates an instance of RoleResolver.
   *
   * @constructor
   * @param {RoleService} roleService
   */
  constructor(private readonly roleService: RoleService) {}

  /**
   * Description placeholder
   *
   * @async
   * @param {CreateRoleDto} input
   * @param {I18nContext} i18n
   * @returns {unknown}
   */
  @Mutation(() => RoleResponse)
  @Permissions('create-role')
  async createRole(
    @Args('input') input: CreateRoleDto,
    @I18n() i18n: I18nContext,
  ): Promise<{
    message: string;
    role: RoleDocument;
  }> {
    const role = await this.roleService.create(input);
    return { message: i18n.t('common.create_success', { args: { entity: 'Role' } }), role };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @param {I18nContext} i18n
   * @param {UpdateRoleDto} input
   * @returns {unknown}
   */
  @Mutation(() => RoleResponse)
  @Permissions('update-role')
  async updateRole(
    @Args('id') id: string,
    @I18n() i18n: I18nContext,
    @Args('input') input: UpdateRoleDto,
  ): Promise<{
    message: string;
  }> {
    await this.roleService.updateRole(id, input);
    return { message: i18n.t('common.update_success', { args: { entity: 'Role' } }) };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @param {I18nContext} i18n
   * @param {UpdateRolePermissionDto} input
   * @returns {unknown}
   */
  @Mutation(() => RoleResponse)
  @Permissions('update-role-permission')
  async updateRolePermissions(
    @Args('id') id: string,
    @I18n() i18n: I18nContext,
    @Args('input') input: UpdateRolePermissionDto,
  ): Promise<{
    message: string;
  }> {
    await this.roleService.updateRolePermissions(id, input);
    return { message: i18n.t('common.update_success', { args: { entity: 'Role permisssion' } }) };
  }

  @Mutation(() => RoleResponse)
  @Permissions('update-role-permissions')
  async updateRolesPermissions(
    @I18n() i18n: I18nContext,
    @Args('input') input: UpdateRolesPermissionDto,
  ): Promise<{
    message: string;
  }> {
    await this.roleService.updateRolesPermissions(input);
    return { message: i18n.t('common.update_success', { args: { entity: 'Role permisssion' } }) };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @param {I18nContext} i18n
   * @returns {unknown}
   */
  @Mutation(() => RoleResponse)
  @Permissions('delete-role')
  async deleteRole(
    @Args('id') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<{
    message: string;
  }> {
    await this.roleService.deleteRoleById(id);
    return { message: i18n.t('common.delete_success', { args: { entity: 'Role' } }) };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @param {I18nContext} i18n
   * @returns {unknown}
   */
  @Query(() => RoleResponse)
  @Permissions('get-role')
  async getRole(
    @Args('id') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<{
    message: string;
    role: RoleDocument;
  }> {
    const role = await this.roleService.getRole(id);
    if (!role) {
      throw new NotFoundException(i18n.t('common.not_exist', { args: { entity: 'Role' } }));
    }

    return {
      message: i18n.t('common.fetch_detail_success', { args: { entity: 'Role' } }),
      role,
    };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {GetRoleDto} input
   * @param {I18nContext} i18n
   * @returns {unknown}
   */
  @Query(() => RoleResponse)
  @Permissions('list-role')
  async getRoles(@I18n() i18n: I18nContext) {
    const data = await this.roleService.getAllRoles();
    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'Role' } }),
      roles: data,
    };
  }
}
