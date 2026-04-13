import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { randomString } from '@app/common/helpers/genericFunction';
import { AdvancePageRepository } from '@app/data-access';
import { I18nService } from 'nestjs-i18n';
import slug from 'slug';
import { CreateAdvancePageDTO } from './dto/input/create-advance-page-dto';
import { GetAdvancePagesDTO, GetAllAdvancePagesDTO } from './dto/input/get-advance-pages.dto';
import { UpdateAdvancePageDTO } from './dto/input/update-advance-page.dto';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PageService
 * @typedef {PageService}
 */
@Injectable()
export class AdvancePageService {
  constructor(
    private readonly advancePageRepository: AdvancePageRepository,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreatePageDTO} input
   * @param {*} user
   * @returns {Promise<any>}
   */
  async createPage(input: CreateAdvancePageDTO, user) {
    const { title, slug: slugInput, status, content } = input;

    const newPage = await this.advancePageRepository.create({
      title,
      slug: slug(slugInput),
      status,
      content,
      createdBy: user._id.toString(),
    });

    if (!newPage) {
      throw new BadRequestException(
        this.i18nService.t('common.invalid_inputs', { args: { entity: 'Page' } }),
      );
    }

    return newPage;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateAdvPageDTO} input
   * @param {*} user
   * @returns {Promise<any>}
   */
  async createAdvPage(input: CreateAdvancePageDTO, user) {
    try {
      const {
        title,
        slug: slugInput,
        status,
        content,
        seoTags,
        banner,
        homePage,
        imageColumn,
        howItWorks,
        featuredProducts,
        faq,
        testimonials,
      } = input;
      const existingPageWithTitle = await this.advancePageRepository.find(
        { title },
        { title: 1, slug: 1 },
      );
      let slugData = slugInput;

      if (existingPageWithTitle.length > 0) {
        slugData = `${slugData}-${randomString(6)}`;
      }

      const newPage = await this.advancePageRepository.create({
        title,
        slug: slug(slugData),
        status,
        content,
        seoTags,
        banner,
        homePage,
        imageColumn,
        howItWorks,
        featuredProducts,
        faq,
        testimonials,
        createdBy: user._id.toString(),
      });

      if (!newPage) {
        throw new BadRequestException(
          this.i18nService.t('common.invalid_inputs', { args: { entity: 'Page' } }),
        );
      }
      return newPage;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetAllPagesDTO} [input={}]
   * @returns {Promise<any>\}
   */
  async listPages(input: GetAllAdvancePagesDTO = {}) {
    const { status } = input;
    const findQuery = {};
    if (status) {
      findQuery['status'] = status;
    }

    console.log('iiiiiiiii');
    return await this.advancePageRepository.find(findQuery, {
      _id: 1,
      title: 1,
      slug: 1,
      status: 1,
    });
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<any>}
   */
  async listPage(id: string) {
    const page = await this.advancePageRepository.findById(id);
    if (!page) {
      throw new NotFoundException(this.i18nService.t('advancePage.invalid_pageId'));
    }
    return page;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetPagesDTO} [input={}]
   * @returns {Promise<any>\}
   */

  async getPages(input: GetAdvancePagesDTO = {}) {
    const { searchText, orderBy, order, limit, skip, status } = input;
    const pageMeta = { limit, skip, orderBy, order };
    let filterQuery = {};

    if (status) {
      filterQuery = {
        //isDeleted: { $ne: true },
        ...filterQuery,
        status,
      };
    }

    if (searchText) {
      filterQuery = {
        ...filterQuery,
        $or: [
          {
            title: { $regex: searchText, $options: 'i' },
          },
          {
            slug: { $regex: searchText, $options: 'i' },
          },
          {
            content: { $regex: searchText, $options: 'i' },
          },
        ],
      };
    }

    // const filter = [filterQuery];

    return this.advancePageRepository.getAllAdvancePages(filterQuery, pageMeta);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {UpdatePageDTO} input
   * @param {*} user
   * @returns {Promise<any>}
   */
  async updatePage(id: string, input: UpdateAdvancePageDTO, user) {
    const {
      title,
      slug: slugInput,
      status,
      content,
      seoTags,
      banner,
      homePage,
      imageColumn,
      howItWorks,
      featuredProducts,
      faq,
      testimonials,
    } = input;
    // find the page if exists;
    const page = await this.advancePageRepository.findById(id);
    if (!page) {
      throw new NotFoundException(this.i18nService.t('advancePage.invalid_pageId'));
    }
    let slugdata = slugInput || page.slug;
    if (page.title == title) {
      slugdata = page.slug;
    }
    const existingPageWithTitle = await this.advancePageRepository.find(
      { slug: slugdata },
      { title: 1, slug: 1 },
    );
    const existingPage = existingPageWithTitle.filter((item) => {
      const mutatedItem = JSON.parse(JSON.stringify(item));
      return JSON.stringify(page._id) != JSON.stringify(mutatedItem._id);
    });

    if (existingPage.length > 0) {
      slugdata = `${slugdata}-${randomString(6)}`;
    }

    const updatedPage = await this.advancePageRepository.updateById(id, {
      title,
      createdBy: user.id,
      slug: slug(slugdata),
      status,
      content,
      seoTags,
      banner,
      homePage,
      imageColumn,
      howItWorks,
      featuredProducts,
      faq,
      testimonials,
    });

    if (!updatedPage) {
      throw new BadRequestException(
        this.i18nService.t('common.invalid_inputs', { args: { entity: 'Page' } }),
      );
    }
    return updatedPage;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deletePage(id: string) {
    const page = await this.advancePageRepository.findById(id);
    if (!page) {
      throw new NotFoundException(this.i18nService.t('advancePage.invalid_pageId'));
    }

    await this.advancePageRepository.softDeleteById(id);
    return true;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<any>}
   */
  async deleteAllPages() {
    return await this.advancePageRepository.softDelete({});
  }
}
