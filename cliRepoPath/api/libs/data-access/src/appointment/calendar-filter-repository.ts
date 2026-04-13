import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Model } from 'mongoose';
import { CalenderFilter, CalenderFilterDocument } from './calendar-filter.schema';
import { toMongoId } from '@app/common/helpers/mongo-helper';

@Injectable()
export class CalendarFilterRepository extends BaseRepo<CalenderFilterDocument> {
  constructor(
    @InjectModel(CalenderFilter.name)
    private readonly calenderFilter: Model<CalenderFilterDocument>,
  ) {
    super(calenderFilter);
  }

  async getFilterDetail(businessId, userId) {
    const stages: any = [
      {
        $match: {
          businessId: businessId,
          userId: toMongoId(userId),
        },
      },
      {
        $lookup: {
          from: 'locations',
          localField: 'appointmentLocations',
          foreignField: '_id',
          as: 'appointmentLocationsData',
          let: {},
          pipeline: [
            {
              $lookup: {
                from: 'timezones',
                as: 'locationTimezone',
                localField: 'timezoneId',
                foreignField: '_id',
              },
            },
            {
              $addFields: {
                locationTimezone: {
                  $arrayElemAt: ['$locationTimezone.name', 0],
                },
              },
            },
          ],
        },
      },

      {
        $lookup: {
          from: 'users',
          let: { id: '$appointmentPractitioners' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$id'] } } },
            {
              $project: {
                fullName: 1,
                profileImage: 1,
                userId: '$_id',
              },
            },
          ],
          as: 'appointmentPractitionersData',
        },
      },

      {
        $lookup: {
          from: 'appointmenttypes',
          localField: 'appointmentTypes',
          foreignField: '_id',
          as: 'appointmentTypesData',
        },
      },
    ];
    const businessList = await this.aggregate(stages);
    return businessList[0] || [];
  }
}
