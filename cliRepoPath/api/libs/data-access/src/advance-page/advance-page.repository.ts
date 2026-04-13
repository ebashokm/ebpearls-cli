import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType } from 'mongoose';
import { BaseRepo } from './../repository/base.repo';
import { AdvancePage, AdvancePageDocument } from './advance-page.schema';

@Injectable()
export class AdvancePageRepository extends BaseRepo<AdvancePageDocument> {
  constructor(
    @InjectModel(AdvancePage.name)
    private readonly page: Model<AdvancePageDocument>,
  ) {
    super(page);
  }

  async getAllAdvancePages(
    filter: any,
    pageMeta: { limit: number; skip: number; orderBy: string; order: string },
  ) {
    const projection: ProjectionType<AdvancePageDocument> = {
      _id: 1,
      title: 1,
      slug: 1,
      status: 1,
      content: 1,
      updatedAt: 1,
      createdAt: 1,
      createdBy: 1,
      lowCaseTitle: { $toLower: '$title' },
    };
    return await this.findWithPaginate(
      filter,
      {
        skip: pageMeta.skip,
        limit: pageMeta.limit,
        orderBy: pageMeta.orderBy,
        order: pageMeta.order,
      },
      projection,
    );
  }
}
