import { MenuRepository } from '@app/data-access';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GetMenusDTO } from './dto/input/get-menus.dto';
import { CreateMenuDTO, UpdateMenuStatusDTO } from './dto/input/create-menu-dto';
import { S3Service, S3_TEMP_FOLDER_NAME } from '@app/common/services/s3';
import { I18nService } from 'nestjs-i18n';
import { PaginationOptions as PaginateOptions } from '@app/data-access/repository/pagination.type';
import { Transactional } from '@nestjs-cls/transactional';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class MenuService
 * @typedef {MenuService}
 */
@Injectable()
export class MenuService {
  /**
   * Creates an instance of MenuService.
   *
   * @constructor
   * @param {MenuRepository} menuRepository
   * @param {S3Service} s3Service
   */
  constructor(
    private readonly menuRepository: MenuRepository,
    private readonly s3Service: S3Service,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateMenuDTO} input
   * @returns {Promise<any>}
   */
  @Transactional()
  async createMenu(input: CreateMenuDTO) {
    try {
      const newMenu = await this.menuRepository.create(input);
      if (!newMenu) {
        throw new BadRequestException(
          this.i18nService.t('common.invalid_inputs', { args: { entity: 'menu' } }),
        );
      }
      const logoKey = input?.logo?.name;
      if (input?.logo?.name) {
        const newLogoKey = `public/menu/${String(newMenu._id)}/${logoKey}`;
        await this.s3Service.copyObject(`${S3_TEMP_FOLDER_NAME}/${logoKey}`, newLogoKey);
      }
      if (input?.menuItems) {
        await Promise.all(
          input?.menuItems?.map(async (menuItem) => {
            const itemImageKey = menuItem?.icon;
            if (itemImageKey) {
              const newItemImageKey = `public/menu/${String(newMenu._id)}/${itemImageKey}`;
              return this.s3Service.copyObject(
                `${S3_TEMP_FOLDER_NAME}/${itemImageKey}`,
                newItemImageKey,
              );
            }
          }),
        );
      }
      if (newMenu.status == 'active') {
        await this.menuRepository.updateMany(
          {
            menuPosition: newMenu.menuPosition,
            _id: { $ne: newMenu._id },
          },
          { status: 'inactive' },
        );
      }
      return newMenu;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<any>}
   */
  async listMenu(id: string) {
    try {
      const menu = await this.menuRepository.findById(id);
      return menu;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetMenusDTO} input
   * @returns {Promise<any>}
   */
  async getAllMenus(input: GetMenusDTO) {
    try {
      const { orderBy, order, limit, skip } = input;
      const pageMeta: PaginateOptions = { limit, skip, orderBy, order };
      const filter = {};
      return await this.menuRepository.getAllMenus(filter, pageMeta);
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {CreateMenuDTO} input
   * @returns {Promise<any>}
   */
  @Transactional()
  async updateMenu(id: string, input: CreateMenuDTO) {
    try {
      const menu = await this.menuRepository.findById(id);
      if (!menu) {
        throw new NotFoundException(
          this.i18nService.t('common.not_exist', { args: { entity: 'Menu' } }),
        );
      }

      const updatedMenu = await this.menuRepository.updateById(id, input, {
        new: true,
      });
      if (!updatedMenu) {
        throw new BadRequestException(
          this.i18nService.t('common.invalid_inputs', { args: { entity: 'Menu' } }),
        );
      }

      const prevImageKey = menu?.logo?.name;
      const logoKey = input?.logo?.name;
      if (logoKey !== undefined && logoKey !== prevImageKey) {
        const newLogoKey = `public/menu/${String(menu._id)}/${logoKey}`;
        await this.s3Service.copyObject(`${S3_TEMP_FOLDER_NAME}/${logoKey}`, newLogoKey);
      }

      if (input?.menuItems) {
        await Promise.all(
          input?.menuItems?.map(async (menuItem) => {
            const itemImageKey = menuItem?.icon;
            if (itemImageKey) {
              const newItemImageKey = `public/menu/${String(menu._id)}/${itemImageKey}`;
              return this.s3Service.copyObject(
                `${S3_TEMP_FOLDER_NAME}/${itemImageKey}`,
                newItemImageKey,
              );
            }
          }),
        );
      }

      if (updatedMenu.status == 'active') {
        await this.menuRepository.updateMany(
          {
            menuPosition: updatedMenu.menuPosition,
            _id: { $ne: updatedMenu._id },
          },
          { status: 'inactive' },
        );
      }

      return updatedMenu;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {UpdateMenuStatusDTO} input
   * @returns {Promise<any>}
   */
  @Transactional()
  async updateMenuStatus(id: string, input: UpdateMenuStatusDTO) {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Menu' } }),
      );
    }

    const updatedMenu = await this.menuRepository.updateById(id, input, {
      new: true,
    });
    if (!updatedMenu) {
      throw new BadRequestException(
        this.i18nService.t('common.invalid_inputs', { args: { entity: 'Menu' } }),
      );
    }
    if (updatedMenu.status == 'active') {
      await this.menuRepository.updateMany(
        {
          menuPosition: updatedMenu.menuPosition,
          _id: { $ne: updatedMenu._id },
        },
        { $set: { status: 'inactive' }, $currentDate: { updatedAt: true } },
      );
    }
    return updatedMenu;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  @Transactional()
  async deleteMenu(id: string) {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Menu' } }),
      );
    }
    await this.menuRepository.softDeleteById(id);
    return true;
  }
}
