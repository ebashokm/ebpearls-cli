import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from '../repository/base.repo';
import { PageWithVersion, PageWithVersionDocument } from './pageWithVersion.schema';

@Injectable()
export class PageWithVersionRepository extends BaseRepo<PageWithVersionDocument> {
  projection;
  constructor(
    @InjectModel(PageWithVersion.name)
    private readonly pageWithVersionModel: Model<PageWithVersionDocument>,
  ) {
    super(pageWithVersionModel);
    /* build projection */
    this.projection = {
      _id: 1,
      title: 1,
      seoTags: 1,
      pageType: 1,
      slug: 1,
      content: 1,
      status: 1,
      version: 1,
      createdAt: 1,
      updatedAt: 1,
    };
  }
  async getAllPages(filter, pageMeta) {
    return this.findWithPaginate(filter, pageMeta, this.projection);
  }
}
