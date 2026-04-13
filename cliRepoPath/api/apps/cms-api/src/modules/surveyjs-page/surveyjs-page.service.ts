import { SurveyJsPage, SurveyJsPageRepository } from '@app/data-access';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { CreateSurveyJsPageInput } from './dto/input/create-surveyjs-page.input';
import { UpdateSurveyJsPageInput } from './dto/input/update-surveyjs-page.input';
import { GetAllSurveyJsPagesInputDTO } from './dto/input/list-surveyjs-page.input';
import { DuplicateSurveyJsPageInput } from './dto/input/duplicate-surveyjs-page.input';
import { SurveyJsPageStatus } from './enum/surveyjs-page-status.enum';
import { FilterQuery } from 'mongoose';

@Injectable()
export class SurveyJsPageService {
  constructor(
    private readonly pageRepository: SurveyJsPageRepository,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * Create a new page
   */
  async create(body: CreateSurveyJsPageInput) {
    try {
      const { title, content, status, seoTags, slug, elements, surveyJson } = body;

      // Check if slug already exists
      const existingPage = await this.pageRepository.findOne({ slug });
      if (existingPage) {
        throw new BadRequestException(this.i18nService.t('page.page_with_same_slug_exists'));
      }

      // Prepare page data
      const pageData = {
        title,
        content,
        seoTags,
        status,
        slug,
        elements: elements || {},
        surveyJson: surveyJson || '',
        publishedAt: status === SurveyJsPageStatus.ACTIVE ? new Date() : null,
      };

      const newPage = await this.pageRepository.create(pageData);

      // If status is ACTIVE, set other pages with same title to INACTIVE
      if (status === SurveyJsPageStatus.ACTIVE) {
        await this.pageRepository.updateMany(
          { _id: { $ne: newPage._id }, title: newPage.title },
          { status: SurveyJsPageStatus.INACTIVE },
        );
      }

      return {
        message: this.i18nService.t('common.created', {
          args: { entity: 'SurveyJsPage' },
        }),
        data: newPage,
      };
    } catch (error: any) {
      // Handle duplicate key error
      if (error.code === 11000 && error.keyPattern?.slug) {
        throw new BadRequestException(this.i18nService.t('page.page_with_same_slug_exists'));
      }
      throw error;
    }
  }

  /**
   * Update an existing page
   */
  async update(body: UpdateSurveyJsPageInput) {
    const { _id, ...rest } = body;

    try {
      // Check if slug is taken by another page
      const existingPage = await this.pageRepository.findOne({
        _id: { $ne: _id },
        slug: rest.slug,
      });

      if (existingPage) {
        throw new BadRequestException(this.i18nService.t('page.page_with_same_slug_exists'));
      }

      // Update page using repository method that handles publishedAt
      const updatedPage = await this.pageRepository.updatePage(_id, rest);

      if (!updatedPage) {
        throw new NotFoundException(
          this.i18nService.t('common.not_exist', { args: { entity: 'SurveyJsPage' } }),
        );
      }

      return {
        message: this.i18nService.t('common.updated', {
          args: { entity: 'SurveyJsPage' },
        }),
        data: updatedPage,
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Find all pages with pagination
   */
  async findAll(input: GetAllSurveyJsPagesInputDTO) {
    try {
      const { searchText, orderBy, order, limit, skip } = input;

      const pageMeta = {
        limit: limit || 5,
        skip: skip || 0,
        order: order || 'desc',
        orderBy: orderBy || '_id',
      };

      // Build filter
      let filter: FilterQuery<SurveyJsPage> = {};
      if (searchText) {
        filter = {
          $or: [
            { title: { $regex: searchText, $options: 'i' } },
            { slug: { $regex: searchText, $options: 'i' } },
          ],
        };
      }

      const result = await this.pageRepository.getAllPages(filter, pageMeta);

      return {
        data: result.data,
        pagination: result.pagination,
        message: this.i18nService.t('common.fetch_list_success', {
          args: { entity: 'SurveyJsPages' },
        }),
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Find a single page by ID
   */
  async findOne(id: string) {
    const page = await this.pageRepository.findById(id);
    if (!page) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'SurveyJsPage' } }),
      );
    }
    return {
      message: this.i18nService.t('common.fetch_success', {
        args: { entity: 'SurveyJsPage' },
      }),
      data: page,
    };
  }

  /**
   * Hard delete a page
   */
  async remove(id: string) {
    const page = await this.pageRepository.findById(id);
    if (!page) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'SurveyJsPage' } }),
      );
    }

    await this.pageRepository.deleteById(id);

    return {
      message: this.i18nService.t('common.deleted', {
        args: { entity: 'SurveyJsPage' },
      }),
    };
  }

  /**
   * Duplicate a page with a new slug
   */
  async duplicatePage(input: DuplicateSurveyJsPageInput) {
    try {
      // Find the original page
      const existingPage = await this.pageRepository.findBySlug(input.slug);
      if (!existingPage) {
        throw new NotFoundException(
          this.i18nService.t('common.not_exist', { args: { entity: 'SurveyJsPage' } }),
        );
      }

      // Generate unique title and slug
      let baseTitle = `${existingPage.title} (Copy)`;
      let baseSlug = `${existingPage.slug}-copy`;

      let newTitle = baseTitle;
      let newSlug = baseSlug;

      // Ensure slug is unique
      let counter = 1;
      while (await this.pageRepository.findBySlug(newSlug)) {
        newTitle = `${baseTitle}-${counter}`;
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Create duplicate
      const newPage = await this.pageRepository.createDuplicate(existingPage, newSlug, newTitle);

      return {
        message: this.i18nService.t('common.duplicate', {
          args: { entity: 'SurveyJsPage' },
        }),
        data: newPage,
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Check if slug exists
   */
  async checkSlugExistence(slug: string): Promise<boolean> {
    return await this.pageRepository.slugExists(slug);
  }
}
