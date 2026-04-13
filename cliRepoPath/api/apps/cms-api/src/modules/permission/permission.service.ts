import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { PermissionRepository } from '@app/data-access/permission';
import { CreatePermissionDto } from './dto/inputs/create-permission.dto';
import { UpdatePermissionDto } from './dto/inputs/update-permission.dto';
import { GetPermissionDto } from './dto/inputs/get-permissions.dto';
import { PermissionModuleRepository } from '@app/data-access/permission-module';

/**
 * Description placeholder
 *
 * @export
 * @class PermissionService
 * @typedef {PermissionService}
 */
@Injectable()
export class PermissionService {
  /**
   * Creates an instance of PermissionService.
   *
   * @constructor
   * @param {PermissionRepository} permissionRepository
   * @param {I18nService} i18nService
   */
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly permissionModuleRepository: PermissionModuleRepository,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * Description placeholder
   *
   * @async
   * @param {CreatePermissionDto} input
   * @returns {unknown}
   */
  async create(input: CreatePermissionDto) {
    try {
      return await this.permissionRepository.create(input);
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @param {UpdatePermissionDto} input
   * @returns {unknown}
   */
  async updatePermission(id: string, input: UpdatePermissionDto) {
    try {
      return await this.permissionRepository.updateOne({ _id: id }, { $set: { ...input } });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @returns {*}
   */
  async deletePermissionById(id: string) {
    const permission = await this.permissionRepository.softDeleteById(id);
    if (!permission) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Permission' } }),
      );
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @returns {unknown}
   */
  async getPermission(id: string) {
    try {
      return await this.permissionRepository.findById(id);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {GetPermissionDto} [input={}]
   * @returns {unknown}
   */
  async getAllPermissions() {
    try {
      const filter = {};
      return await this.permissionRepository.getAllPermissions(filter);
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  async getPermissionModules() {
    try {
      const filter = {};
      return await this.permissionModuleRepository.find(filter);
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
