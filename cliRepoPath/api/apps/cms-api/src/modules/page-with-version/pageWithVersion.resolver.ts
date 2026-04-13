import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { PageWithVersionResponse } from './dto/response/page.response';
import { I18n, I18nContext } from 'nestjs-i18n';
import { PageWithVersionService } from './pageWithVersion.service';
import { CreatePageWithVersionInput } from './dto/input/create-page.input';
import { UpdatePageWithVersionInput } from './dto/input/update-page.input';
import { GetAllPagesWithVersionInputDTO } from './dto/input/list-page.input';
import { Permissions } from '../auth/decorator/permissions.decorator';
/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CmsPageResolver
 * @typedef {CmsPageResolver}
 */
@Resolver(() => PageWithVersionResponse)
export class PageWithVersionResolver {
  constructor(private readonly pageWithVersionService: PageWithVersionService) {}

  /**
   * ${1:Description placeholder}
   *
   * @param {CreateCmsPageInput} body
   * @returns {*}
   */
  @Mutation(() => PageWithVersionResponse)
  @Permissions('create-page-with-version')
  createPageWithVersion(@Args('body') body: CreatePageWithVersionInput) {
    return this.pageWithVersionService.create(body);
  }

  /**
   * ${1:Description placeholder}
   *
   * @param {UpdateCmsPageInput} body
   * @returns {*}
   */
  @Permissions('update-page-with-version')
  @Mutation(() => PageWithVersionResponse)
  updatePageWithVersion(@Args('body') body: UpdatePageWithVersionInput) {
    return this.pageWithVersionService.update(body);
  }

  /**
   * ${1:Description placeholder}
   *
   * @returns {*}
   */
  @Query(() => PageWithVersionResponse, { name: 'findAllPagesWithVersiion' })
  @Permissions('list-page-with-version')
  async findAllPagesWithVersion(
    @Args('input') input: GetAllPagesWithVersionInputDTO,
    @I18n() i18n: I18nContext,
  ) {
    const pages = await this.pageWithVersionService.findAll(input);
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
  @Query(() => PageWithVersionResponse, { name: 'getPageWithVersion' })
  @Permissions('get-page-with-version')
  findOneWithVersion(@Args('id') id: string) {
    return this.pageWithVersionService.findOne(id);
  }

  /**
   * ${1:Description placeholder}
   *
   * @param {number} id
   * @returns {*}
   */
  @Mutation(() => MessageResponse)
  @Permissions('delete-page-with-version')
  removePageWithVersion(@Args('id') id: string) {
    return this.pageWithVersionService.remove(id);
  }
}
