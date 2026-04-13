import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { PageResponse } from './dto/response/page.response';
import { PageService } from './page.service';
import { CreatePageInput } from './dto/input/create-page.input';
import { UpdatePageInput } from './dto/input/update-page.input';
import { GetAllPagesInputDTO } from './dto/input/list-page.input';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Permissions } from '../auth/decorator/permissions.decorator';
/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CmsPageResolver
 * @typedef {CmsPageResolver}
 */
@Resolver(() => PageResponse)
export class PageResolver {
  constructor(private readonly pageService: PageService) {}

  /**
   * ${1:Description placeholder}
   *
   * @param {CreateCmsPageInput} body
   * @returns {*}
   */
  @Mutation(() => MessageResponse)
  @Permissions('create-page')
  async createPage(@Args('body') body: CreatePageInput, @I18n() i18n: I18nContext) {
    await this.pageService.create(body);
    return {
      message: i18n.t('common.create_success', { args: { entity: 'Page' } }),
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @param {UpdateCmsPageInput} body
   * @returns {*}
   */
  @Mutation(() => MessageResponse)
  @Permissions('update-page')
  async updatePage(@Args('body') body: UpdatePageInput, @I18n() i18n: I18nContext) {
    await this.pageService.update(body);
    return {
      message: i18n.t('common.update_success', { args: { entity: 'Page' } }),
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @returns {*}
   */
  @Query(() => PageResponse, { name: 'findAllPages' })
  @Permissions('list-page')
  async findAllPages(@Args('input') input: GetAllPagesInputDTO, @I18n() i18n: I18nContext) {
    const pages = await this.pageService.findAll(input);
    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'Pages' } }),
      data: pages?.data,
      pagination: pages?.pagination,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @param {number} id
   * @returns {*}
   */
  @Query(() => PageResponse, { name: 'page' })
  @Permissions('get-page')
  async findOne(@Args('id') id: string, @I18n() i18n: I18nContext) {
    const page = await this.pageService.findOne(id);

    return {
      message: i18n.t('common.fetch_detail_success', { args: { entity: 'Page detail' } }),
      data: page ? [page] : [],
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @param {number} id
   * @returns {*}
   */
  @Permissions('delete-page')
  @Mutation(() => MessageResponse)
  async removePage(@Args('id') id: string) {
    return await this.pageService.remove(id);
  }
}
