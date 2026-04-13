import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
} from '@nestjs/common';
import { UsersRepository } from '@app/data-access';
import { Order } from '@app/common/enum/pagination';
import { I18nService } from 'nestjs-i18n';
import { PageWithVersion, PageWithVersionRepository } from '@app/data-access/pageWithVersion';
import { CreatePageWithVersionInput } from './dto/input/create-page.input';
import { UpdatePageWithVersionInput } from './dto/input/update-page.input';
import {
  PageStatusWithVersion,
  PageTypeWithVersion,
} from '@app/data-access/pageWithVersion/pageWithVersion.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GetAllPagesWithVersionInputDTO } from './dto/input/list-page.input';
import { UserTermsVersionUpdatedEventDTO } from './dto/event/user-terms-version-updated.event.dto';
import { FilterQuery } from 'mongoose';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class PageWithVersionService implements OnModuleDestroy {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly i18nService: I18nService,
    private readonly pageWithVersionRepository: PageWithVersionRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onModuleDestroy() {
    this.eventEmitter.removeAllListeners('user.termsVersionUpdated');
  }

  @Transactional()
  async create(body: CreatePageWithVersionInput) {
    const { title, version, content, status, seoTags, pageType, slug } = body;
    try {
      this.eventEmitter.emit('user.termsVersionUpdated', {
        isTermsVersionSynced: false,
      } as UserTermsVersionUpdatedEventDTO);

      const formattedSlug = `${slug}-${version}`;
      const existingCmsPage = await this.pageWithVersionRepository.findOne({
        $or: [
          {
            version: body?.version,
            pageType: body?.pageType,
          },
          { slug: formattedSlug }, // Check if slug already exists
        ],
      });

      if (existingCmsPage) {
        if (existingCmsPage.slug === formattedSlug) {
          throw new BadRequestException(this.i18nService.t('page.page_with_same_slug_exists'));
        } else {
          throw new BadRequestException(this.i18nService.t('page.page_already_exists'));
        }
      }

      const cmsPageData = {
        title,
        content,
        seoTags,
        pageType,
        version,
        status,
        slug: formattedSlug,
      };
      const newCmsPage = await this.pageWithVersionRepository.create(cmsPageData);
      if (body.status && body.status === PageStatusWithVersion.ACTIVE) {
        await this.pageWithVersionRepository.updateMany(
          { _id: { $ne: newCmsPage._id }, title: newCmsPage.title },
          { status: PageStatusWithVersion.INACTIVE },
        );

        if (
          title == PageTypeWithVersion.TERMS_AND_CONDITION ||
          title == PageTypeWithVersion.ABOUT ||
          title == PageTypeWithVersion.CONTACT ||
          title == PageTypeWithVersion.PRIVACY_POLICY
        ) {
          this.eventEmitter.emit('user.termsVersionUpdated', {
            isTermsVersionSynced: false,
          });
        }
      }
      return newCmsPage;
    } catch (error: any) {
      throw error;
    }
  }

  @Transactional()
  async update(body: UpdatePageWithVersionInput) {
    const { id, ...rest } = body;
    try {
      const formattedSlug = `${body?.slug}-${body?.version}`;
      const existingCmsPage = await this.pageWithVersionRepository.findOne({
        _id: { $ne: id }, // Exclude the current document by ID
        $or: [
          {
            version: body?.version,
            pageType: body?.pageType,
            slug: formattedSlug,
          },
        ],
      });

      if (existingCmsPage) {
        throw new BadRequestException(this.i18nService.t('page.page_already_exists'));
      }
      const formattedData = {
        ...rest,
        slug: formattedSlug,
      };

      const cmsPage = await this.pageWithVersionRepository.updateById(id, formattedData, {
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
  async findAll(input: GetAllPagesWithVersionInputDTO) {
    try {
      const { searchText, orderBy, order, limit, skip } = input;

      const pageMeta = {
        limit,
        skip,
        order,
        orderBy,
      };

      /* create filter pipeline */

      const filter: FilterQuery<PageWithVersion> = {
        ...(searchText && { title: { $regex: searchText, $options: 'i' } }),
        ...(input?.pageType && { pageType: input.pageType }),
      };

      return await this.pageWithVersionRepository.getAllPages(filter, pageMeta);
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
    const page = await this.pageWithVersionRepository.findById(id);
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
    const page = await this.pageWithVersionRepository.findById(id);
    if (!page) {
      throw new NotFoundException(
        this.i18nService.t('page.not_exist', { args: { entity: 'Page' } }),
      );
    }

    await this.pageWithVersionRepository.deleteById(id);
    return true;
  }
}
