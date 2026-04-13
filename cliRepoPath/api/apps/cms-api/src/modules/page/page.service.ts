import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PageRepository } from '@app/data-access';
import { CreatePageInput } from './dto/input/create-page.input';
import { PageType } from '@app/data-access/page/page.enum';
import { UpdatePageInput } from './dto/input/update-page.input';
import { GetAllPagesInputDTO } from './dto/input/list-page.input';
import { Order } from '@app/common/enum/pagination';
import { I18nService } from 'nestjs-i18n';
import { PageStatus } from './enum/page-status.enum';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class PageService {
  constructor(
    private readonly pageRepository: PageRepository,
    private readonly i18nService: I18nService,
  ) {}

  @Transactional()
  async create(body: CreatePageInput) {
    const { title, content, status, seoTags, pageType, slug } = body;
    try {
      let query = {
        slug,
      };

      // If pageType is not "generic", include it in the query
      if (pageType !== PageType.GENERIC) {
        query['pageType'] = body?.pageType;
      }

      const existingCmsPage = await this.pageRepository.findOne(query);
      if (existingCmsPage) {
        if (existingCmsPage.slug === slug && existingCmsPage?.pageType === pageType) {
          throw new BadRequestException(this.i18nService.t('page.page_already_exists'));
        } else {
          throw new BadRequestException(this.i18nService.t('page.page_with_same_slug_exists'));
        }
      }

      const cmsPageData = {
        title,
        content,
        seoTags,
        pageType,
        status,
        slug: slug,
      };
      const newCmsPage = await this.pageRepository.create(cmsPageData);
      if (body.status && body.status === PageStatus.ACTIVE) {
        await this.pageRepository.updateMany(
          { _id: { $ne: newCmsPage._id }, title: newCmsPage.title },
          { status: PageStatus.INACTIVE },
        );
      }
      return newCmsPage;
    } catch (error: any) {
      // Check if error is a duplicate key error (if you already have unique indexes in the DB)
      if (error.code === 11000 && error.keyPattern?.slug) {
        throw new BadRequestException(this.i18nService.t('page.page_with_same_slug_exists'));
      }
      throw error;
    }
  }

  @Transactional()
  async update(body: UpdatePageInput) {
    const { id, ...rest } = body;
    try {
      const existingCmsPage = await this.pageRepository.findOne({
        _id: { $ne: id }, // Exclude the current document by ID
        $or: [
          {
            slug: body?.slug,
          },
        ],
      });

      if (existingCmsPage) {
        throw new BadRequestException(this.i18nService.t('page.page_with_same_slug_exists'));
      }

      const cmsPage = await this.pageRepository.updateById(id, rest, {
        new: true,
      });
      return cmsPage;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {{}} [input={\}]
   * @returns {Promise<any>\}
   */
  async findAll(input: GetAllPagesInputDTO) {
    try {
      const { searchText, orderBy, order, limit, skip } = input;

      const pageMeta = {
        limit,
        skip,
        order,
        orderBy,
      };

      /* create filter pipeline */
      const filter = {
        $or: [{ title: { $regex: searchText, $options: 'i' } }],
      };
      return await this.pageRepository.getAllPages(filter, pageMeta);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @param {number} id
   * @returns {string}
   */
  async findOne(id: string) {
    const page = await this.pageRepository.findById(id);
    if (!page) {
      throw new NotFoundException(
        this.i18nService.t('page.not_exist', { args: { entity: 'Page' } }),
      );
    }
    return page;
  }

  /**
   * ${1:Description placeholder}
   *
   * @param {number} id
   * @returns {string}
   */
  @Transactional()
  async remove(id: string) {
    const page = await this.pageRepository.findById(id);
    if (!page) {
      throw new NotFoundException(
        this.i18nService.t('page.not_exist', { args: { entity: 'Page' } }),
      );
    }

    await this.pageRepository.softDeleteById(id);
    return true;
  }
}
