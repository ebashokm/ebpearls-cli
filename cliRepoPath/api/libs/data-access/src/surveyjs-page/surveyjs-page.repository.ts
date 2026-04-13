import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepo } from '../repository/base.repo';
import { SurveyJsPage, SurveyJsPageDocument } from './surveyjs-page.schema';
import { PaginationOptions } from '../repository/pagination.type';
import { SurveyJsPageStatus } from './surveyjs-page.enum';

@Injectable()
export class SurveyJsPageRepository extends BaseRepo<SurveyJsPageDocument> {
  projection;

  constructor(
    @InjectModel(SurveyJsPage.name)
    private readonly surveyJsPageModel: Model<SurveyJsPageDocument>,
  ) {
    super(surveyJsPageModel);

    // Build default projection
    this.projection = {
      _id: 1,
      title: 1,
      seoTags: 1,
      slug: 1,
      content: 1,
      status: 1,
      createdAt: 1,
      updatedAt: 1,
      version: 1,
      surveyJson: 1,
      elements: 1,
      publishedAt: 1,
      isDuplicated: 1,
      isDeleted: 1,
      deletedAt: 1,
    };
  }

  /**
   * Get all pages with pagination (used by list view)
   */
  async getAllPages(filter: any, pageMeta: PaginationOptions) {
    return this.findWithPaginate(filter, pageMeta, this.projection);
  }

  /**
   * Check if slug exists (excluding a specific ID)
   */
  async slugExists(slug: string, excludeId?: Types.ObjectId): Promise<boolean> {
    const query: any = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await this.findOne(query);
    return !!existing;
  }

  /**
   * Find page by slug
   */
  async findBySlug(slug: string): Promise<SurveyJsPageDocument | null> {
    return this.findOne({ slug });
  }

  /**
   * Create duplicate with unique slug
   */
  async createDuplicate(
    originalPage: SurveyJsPageDocument,
    newSlug: string,
    newTitle: string,
  ): Promise<SurveyJsPageDocument> {
    const duplicateData: any = {
      ...originalPage.toObject(),
      title: newTitle,
      slug: newSlug,
      status: SurveyJsPageStatus.INACTIVE,
      publishedAt: null,
      isDuplicated: true,
    };

    // Remove MongoDB system fields
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    delete duplicateData.__v;
    delete duplicateData.deletedAt;
    delete duplicateData.isDeleted;

    return this.create(duplicateData);
  }

  /**
   * Update page and set publishedAt if status is ACTIVE
   */
  async updatePage(
    id: string | Types.ObjectId,
    updateData: Partial<SurveyJsPage>,
  ): Promise<SurveyJsPageDocument | null> {
    // Convert string to ObjectId if necessary
    const objectId: any = typeof id === 'string' ? new Types.ObjectId(id) : id;

    // Set publishedAt based on status
    if (updateData.status === SurveyJsPageStatus.ACTIVE) {
      updateData.publishedAt = new Date();
    } else if (updateData.status === SurveyJsPageStatus.INACTIVE) {
      updateData.publishedAt = null;
    }

    return this.updateById(objectId, updateData, { new: true });
  }
}
