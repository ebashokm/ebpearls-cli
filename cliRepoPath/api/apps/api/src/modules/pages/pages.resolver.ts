import { Args, Query, Resolver } from '@nestjs/graphql';
import { PagesService } from './pages.service';
import { Page, PageResponse } from './dto/get-page.dto';
import { I18n, I18nContext } from 'nestjs-i18n';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PagesResolver
 * @typedef {PagesResolver}
 */
@Resolver(() => Page)
export class PagesResolver {
  /**
   * Creates an instance of PagesResolver.
   *
   * @constructor
   * @param {PagesService} pagesService
   */
  constructor(private readonly pagesService: PagesService) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} slug
   * @returns {Promise<{ message: string; page: PageResponse; }>\}
   */
  @Query(() => PageResponse)
  async getPageBySlug(@Args('slug') slug: string, @I18n() i18n: I18nContext) {
    const page = await this.pagesService.getPageBySlug(slug);

    return { message: i18n.t('pages.page_list'), page };
  }
}
