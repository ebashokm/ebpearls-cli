import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FAQ, FAQDocument } from './faq.schema';
import { BaseRepo } from './../repository/base.repo';
import { PaginationOptions } from '../repository/pagination.type';

@Injectable()
export class FAQRepository extends BaseRepo<FAQDocument> {
  projection;
  constructor(@InjectModel(FAQ.name) private readonly faq: Model<FAQDocument>) {
    super(faq);

    this.projection = {
      _id: 1,
      section: 1,
      description: 1,
      content: 1,
      createdAt: 1,
      updatedAt: 1,
    };
  }

  async getAllFAQs(filter: any, pageMeta: PaginationOptions) {
    return this.findWithPaginate(filter, pageMeta, this.projection);
  }

  async getFAQ(filter) {
    return this.find(filter, this.projection);
  }
}
