import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotFoundException, SetMetadata } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/inputs/create-permission.dto';
import { UpdatePermissionDto } from './dto/inputs/update-permission.dto';
import { GetPermissionDto } from './dto/inputs/get-permissions.dto';
import {
  ListPermissionModuleResponse,
  Permission,
  PermissionResponse,
} from './dto/response/permission.response';
import { PermissionDocument } from '@app/data-access/permission';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { Cache } from '@app/graphql-redis-cache/index';

/**
 * Description placeholder
 *
 * @export
 * @class PermissionResolver
 * @typedef {PermissionResolver}
 */
@Resolver(() => Permission)
export class PermissionResolver {
  /**
   * Creates an instance of PermissionResolver.
   *
   * @constructor
   * @param {PermissionService} permissionService
   */
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * Description placeholder
   *
   * @async
   * @param {CreatePermissionDto} input
   * @param {I18nContext} i18n
   * @returns {unknown}
   */
  @Mutation(() => PermissionResponse)
  @Permissions('create-permission')
  async createPermission(
    @Args('input') input: CreatePermissionDto,
    @I18n() i18n: I18nContext,
  ): Promise<{
    message: string;
    permission: PermissionDocument;
  }> {
    const permission = await this.permissionService.create(input);
    return {
      message: i18n.t('common.create_success', { args: { entity: 'Permission' } }),
      permission,
    };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @param {I18nContext} i18n
   * @param {UpdatePermissionDto} input
   * @returns {unknown}
   */
  @Mutation(() => PermissionResponse)
  @Permissions('update-permission')
  async updatePermission(
    @Args('id') id: string,
    @I18n() i18n: I18nContext,
    @Args('input') input: UpdatePermissionDto,
  ): Promise<{
    message: string;
  }> {
    await this.permissionService.updatePermission(id, input);
    return { message: i18n.t('common.update_success', { args: { entity: 'Permission' } }) };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @param {I18nContext} i18n
   * @returns {unknown}
   */
  @Mutation(() => PermissionResponse)
  @Permissions('delete-permission')
  async deletePermission(
    @Args('id') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<{
    message: string;
  }> {
    await this.permissionService.deletePermissionById(id);
    return { message: i18n.t('common.delete_success', { args: { entity: 'Permission' } }) };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @param {I18nContext} i18n
   * @returns {unknown}
   */
  @Query(() => PermissionResponse)
  @Permissions('get-permission')
  async getPermission(
    @Args('id') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<{
    message: string;
    permission: PermissionDocument;
  }> {
    const permission = await this.permissionService.getPermission(id);
    if (!permission) {
      throw new NotFoundException(i18n.t('common.not_exist', { args: { entity: 'Permission' } }));
    }

    return {
      message: i18n.t('common.fetch_detail_success', { args: { entity: 'Permission' } }),
      permission,
    };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {GetPermissionDto} input
   * @param {I18nContext} i18n
   * @returns {unknown}
   */

  @Query(() => PermissionResponse)
  @Permissions('list-permission')
  @Cache()
  async getPermissions(@I18n() i18n: I18nContext) {
    const data = await this.permissionService.getAllPermissions();
    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'Permission' } }),
      permissions: data,
    };
  }

  @Query(() => ListPermissionModuleResponse)
  @Permissions('list-permission-module')
  async getPermissionModules(@I18n() i18n: I18nContext) {
    const permissionModules = await this.permissionService.getPermissionModules();
    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'Permission Modules' } }),
      permissionModules,
    };
  }
}
