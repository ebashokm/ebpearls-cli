import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { S3Service } from '@app/common/services/s3';
import { CurrentUser } from '../auth/decorator/get-user.decorator';
import { AdvancePageResponse } from './dto/response/advance-page.response';
import { GetAdvancePagesDTO } from './dto/input/get-advance-pages.dto';
import { CreateAdvancePageDTO } from './dto/input/create-advance-page-dto';
import { UpdateAdvancePageDTO } from './dto/input/update-advance-page.dto';
import { AdvancePageService } from './advance-page.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AdvancePage } from '@app/data-access';
import { BadRequestException } from '@nestjs/common';
import { Permissions } from '../auth/decorator/permissions.decorator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PageResolver
 * @typedef {PageResolver}
 */
@Resolver(() => AdvancePage)
export class AdvancePageResolver {
  /**
   * Creates an instance of PageResolver.
   *
   * @constructor
   * @param {PageService} advancePageService
   * @param {S3Service} s3service
   */
  constructor(
    private readonly advancePageService: AdvancePageService,
    private readonly s3service: S3Service,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetAllPagesDTO} input
   * @returns {Promise<{ message: string; pages: any; }>\}
   */
  // @Query(() => AllAdvancePagesResponse)
  // @Auth(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, AdminRoles.EDITOR)
  // async listAlladvancePages(
  //   @Args('input') input: GetAllAdvancePagesDTO,
  //   @I18n() i18n: I18nContext,
  // ) {
  //   const pages = await this.advancePageService.listPages(input);

  //   return {
  //     message: i18n.t('common.fetch_list_success', { args: { entity: 'Pages' } }),
  //     pages,
  //   };
  // }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetPagesDTO} [input={}]
   * @returns {Promise<{ message: string; pages: any; pagination: any; \}>\}
   */
  @Query(() => AdvancePageResponse)
  @Permissions('list-page')
  async listAdvancePages(@I18n() i18n: I18nContext, @Args('input') input: GetAdvancePagesDTO = {}) {
    const { data: pages, pagination } = await this.advancePageService.getPages(input);

    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'Pages' } }),
      pages,
      pagination,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<{ message: string; page: any; }>\}
   */
  @Query(() => AdvancePageResponse)
  @Permissions('get-page')
  async listAdvancePage(@Args('id') id: string, @I18n() i18n: I18nContext) {
    const page = await this.advancePageService.listPage(id);
    return { message: i18n.t('common.fetch_detail_success', { args: { entity: 'Page' } }), page };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreatePageDTO} input
   * @param {*} user
   * @returns {Promise<{ message: string; page: any; }>\}
   */
  // @Mutation(() => AdvancePageResponse)
  // @Auth(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, AdminRoles.EDITOR)
  // async createPage(@Args('input') input: CreateAdvancePageDTO, @CurrentUser() user) {
  //   try {
  //     const page = await this.advancePageService.createPage(input, user);
  //     return { message: 'Page created successfully', page };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateAdvPageDTO} input
   * @param {*} user
   * @returns {Promise<{ message: string; page: any; }>\}
   */
  @Mutation(() => AdvancePageResponse)
  @Permissions('create-page')
  async createAdvancePage(
    @Args('input') input: CreateAdvancePageDTO,
    @CurrentUser() user,
    @I18n() i18n: I18nContext,
  ) {
    const page = await this.advancePageService.createAdvPage(input, user);

    return {
      message: i18n.t('common.create_success', { args: { entity: 'Page' } }),
      page,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {UpdatePageDTO} input
   * @param {*} user
   * @returns {Promise<{ message: string; page: any; }>\}
   */
  @Mutation(() => AdvancePageResponse)
  @Permissions('update-page')
  async updateAdvancePage(
    @Args('id') id: string,
    @Args('input') input: UpdateAdvancePageDTO,
    @CurrentUser() user,
    @I18n() i18n: I18nContext,
  ) {
    try {
      const updatePage = this.advancePageService.updatePage(id, input, user);

      return {
        message: i18n.t('common.update_success', { args: { entity: 'Page' } }),
        page: updatePage,
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
   * @returns {Promise<{ message: string; }>\}
   */
  @Mutation(() => AdvancePageResponse)
  @Permissions('delete-page')
  async deleteAdvancePage(@Args('id') id: string, @I18n() i18n: I18nContext) {
    await this.advancePageService.deletePage(id);

    return { message: i18n.t('common.delete_success', { args: { entity: 'Page' } }) };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<{ message: string; }>\}
   */
  @Mutation(() => AdvancePageResponse)
  @Permissions('delete-page')
  async deleteAllAdvancePages(@I18n() i18n: I18nContext) {
    await this.advancePageService.deleteAllPages();
    return { message: i18n.t('common.delete_all_success', { args: { entity: 'Pages' } }) };
  }
}
