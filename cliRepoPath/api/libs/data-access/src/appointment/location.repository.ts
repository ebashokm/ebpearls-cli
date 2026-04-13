import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Model } from 'mongoose';

import { Locations, LocationsDocument } from './location.schema';
import { toMongoId } from '@app/common/helpers/mongo-helper';

@Injectable()
export class LocationsRepository extends BaseRepo<LocationsDocument> {
  constructor(
    @InjectModel(Locations.name)
    private readonly locations: Model<LocationsDocument>,
  ) {
    super(locations);
  }

  async getLocations(businessId: string) {
    return await this.aggregate([
      {
        $match: {
          businessId: toMongoId(businessId),
        },
      },
      {
        $lookup: {
          from: 'timezones',
          as: 'timezone',
          localField: 'timezoneId',
          foreignField: '_id',
        },
      },
      {
        $project: {
          name: 1,
          locationAddress: 1,
          locationTimezone: { $first: '$timezone.name' },
        },
      },
    ]);
  }
}
