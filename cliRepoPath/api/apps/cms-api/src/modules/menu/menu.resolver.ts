import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetMenusDTO } from './dto/input/get-menus.dto';
import { Menu, MenuResponse } from './dto/response/menu.response';
import { MenuService } from './menu.service';
import { CreateMenuDTO, UpdateMenuStatusDTO } from './dto/input/create-menu-dto';
import { S3Service } from '@app/common/services/s3';
import { SignedUrlMethod } from '@app/common/enum/signed-url.enum';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { BadRequestException } from '@nestjs/common';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class MenuResolver
 * @typedef {MenuResolver}
 */
@Resolver(() => Menu)
export class MenuResolver {
  /**
   * Creates an instance of MenuResolver.
   *
   * @constructor
   * @param {MenuService} menuService
   * @param {S3Service} s3service
   */
  constructor(
    private readonly menuService: MenuService,
    private readonly s3service: S3Service,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetMenusDTO} input
   * @returns {Promise<{ message: string; menus: any; pagination: any; }>\}
   */
  @Query(() => MenuResponse)
  @Permissions('list-menu')
  async listMenus(@Args('input') input: GetMenusDTO, @I18n() i18n: I18nContext) {
    const { data: menus, pagination } = await this.menuService.getAllMenus(input);
    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'Menus' } }),
      menus,
      pagination,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<{ message: string; menu: any; }>\}
   */
  @Query(() => MenuResponse)
  @Permissions('get-menu')
  async listMenu(@Args('id') id: string, @I18n() i18n: I18nContext) {
    const menu = await this.menuService.listMenu(id);

    if (menu?.logo?.objectKey) {
      const objectKey = `public/menu/${String(menu._id)}/${menu.logo.name}`;
      const contentType = menu.logo?.contentType;
      const imageUrl = await this.s3service.getPreSignedUrl(
        objectKey,
        SignedUrlMethod.GET,
        contentType,
      );

      menu.logo = {
        name: menu.logo.name,
        objectKey,
        contentType,
        url: imageUrl,
      };
    }

    return { message: i18n.t('common.fetch_detail_success', { args: { entity: 'Menu' } }), menu };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateMenuDTO} input
   * @returns {Promise<{ message: string; menu: any; }>\}
   */
  @Mutation(() => MenuResponse)
  @Permissions('create-menu')
  async createMenu(@Args('input') input: CreateMenuDTO, @I18n() i18n: I18nContext) {
    try {
      const menu = await this.menuService.createMenu(input);

      return { message: i18n.t('common.create_success', { args: { entity: 'Menu' } }), menu };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<{ message: string; }>\}
   */
  @Mutation(() => MenuResponse)
  @Permissions('delete-menu')
  async deleteMenu(@Args('id') id: string, @I18n() i18n: I18nContext) {
    await this.menuService.deleteMenu(id);
    return { message: i18n.t('common.delete_success', { args: { entity: 'Menu' } }) };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {CreateMenuDTO} input
   * @returns {Promise<{ message: string; page: any; }>\}
   */
  @Mutation(() => MenuResponse)
  @Permissions('update-menu')
  async updateMenu(
    @Args('id') id: string,
    @Args('input') input: CreateMenuDTO,
    @I18n() i18n: I18nContext,
  ) {
    try {
      const updateMenu = await this.menuService.updateMenu(id, input);

      return {
        message: i18n.t('common.update_success', { args: { entity: 'Menu' } }),
        page: updateMenu,
      };
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
   * @returns {Promise<{ message: string; page: Promise<any>; }>\}
   */
  @Mutation(() => MenuResponse)
  @Permissions('update-menu-status')
  async updateMenuStatus(
    @Args('id') id: string,
    @Args('input') input: UpdateMenuStatusDTO,
    @I18n() i18n: I18nContext,
  ) {
    try {
      const updateMenuStatus = this.menuService.updateMenuStatus(id, input);
      return {
        message: i18n.t('common.update_status_success', { args: { entity: 'Menu' } }),
        page: updateMenuStatus,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
