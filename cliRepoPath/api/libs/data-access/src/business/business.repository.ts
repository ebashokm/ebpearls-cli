import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Business, BusinessDocument } from './business.schema';
import { Model } from 'mongoose';
import { PaginationOptions } from '../repository/pagination.type';
import { toMongoId } from '@app/common/helpers/mongo-helper';

@Injectable()
export class BusinessRepository extends BaseRepo<BusinessDocument> {
  constructor(
    @InjectModel(Business.name)
    private readonly business: Model<BusinessDocument>,
  ) {
    super(business);
  }

  async getAllBusiness(filter, pageMeta: PaginationOptions) {
    return this.findWithPaginate(filter, pageMeta);
  }

  async getDefaultBusinessTimezone(businessId: string) {
    const result = await this.aggregate([
      {
        $match: {
          _id: toMongoId(businessId),
        },
      },
      {
        $lookup: {
          from: 'timezones',
          localField: 'timezoneId',
          foreignField: '_id',
          as: 'timezone',
        },
      },
      {
        $unwind: '$timezone',
      },
    ]);
    return result[0]?.timezone;
  }
}
