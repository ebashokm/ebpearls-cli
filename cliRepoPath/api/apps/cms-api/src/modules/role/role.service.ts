import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  CreateRoleDto,
  UpdateRolePermissionDto,
  UpdateRolesPermissionDto,
} from './dto/inputs/create-role.dto';
import { RoleDocument, RoleRepository } from '@app/data-access/roles';
import { UpdateRoleDto } from './dto/inputs/update-role.dto';
import { toMongoId } from '@app/common/helpers/mongo-helper';

/**
 * Description placeholder
 *
 * @export
 * @class RoleService
 * @typedef {RoleService}
 */
@Injectable()
export class RoleService {
  /**
   * Creates an instance of RoleService.
   *
   * @constructor
   * @param {RoleRepository} roleRepository
   * @param {I18nService} i18nService
   */
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @param {UpdateRolePermissionDto} input
   * @returns {unknown}
   */
  async updateRolePermissions(id: string, input: UpdateRolePermissionDto) {
    try {
      return await this.roleRepository.updateById(
        id,
        { permissions: input.permissions },
        { new: true },
      );
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateRolesPermissions(input: UpdateRolesPermissionDto): Promise<any> {
    try {
      const bulkOperations = input.rolesPermissions.map(({ role, permissions }) => {
        const permissionIds = permissions.map((id) => toMongoId(id));
        return {
          updateOne: {
            filter: { _id: toMongoId(role) },
            update: { $set: { permissions: permissionIds } },
            upsert: true,
          },
        };
      });

      return await this.roleRepository.bulkUpdateRolePermission(bulkOperations);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {CreateRoleDto} input
   * @returns {unknown}
   */
  async create(input: CreateRoleDto): Promise<RoleDocument> {
    try {
      const role = { ...input, permissions: input.permissions?.map((id) => toMongoId(id)) };
      return await this.roleRepository.create(role);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @param {UpdateRoleDto} input
   * @returns {unknown}
   */
  async updateRole(id: string, input: UpdateRoleDto) {
    try {
      return await this.roleRepository.updateOne({ _id: id }, { $set: { ...input } });
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
  async deleteRoleById(id: string) {
    const role = await this.roleRepository.deleteById(id);
    if (!role) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Role' } }),
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
  async getRole(id: string) {
    try {
      return await this.roleRepository.findById(id);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {GetRoleDto} [input={}]
   * @returns {unknown}
   */
  async getAllRoles() {
    try {
      const filter = {};
      return await this.roleRepository.getAllRoles(filter);
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
