import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Model, PipelineStage } from 'mongoose';
import { AppointmentSettings, AppointmentSettingsDocument } from './appointment-setting.schema';

@Injectable()
export class AppointmentSettingsRepository extends BaseRepo<AppointmentSettingsDocument> {
  constructor(
    @InjectModel(AppointmentSettings.name)
    private readonly appointmentSettings: Model<AppointmentSettingsDocument>,
  ) {
    super(appointmentSettings);
  }

  getAppointmentSettingsDetail(businessId: string, input) {
    const stages: PipelineStage[] = [];
    stages.push({
      $match: {
        businessId: businessId,
      },
    });

    stages.push({
      $lookup: {
        from: 'users',
        let: { teamMemberIds: '$teamMembersOrder' },
        pipeline: [
          {
            $match: {
              $expr: { $in: ['$_id', '$$teamMemberIds'] },
            },
          },
          {
            $addFields: {
              sort: {
                $indexOfArray: ['$$teamMemberIds', '$_id'],
              },
            },
          },
          { $sort: { sort: 1 } },
          { $addFields: { sort: '$$REMOVE' } },
        ],
        as: 'userDetails',
      },
    });
    stages.push({
      $lookup: {
        from: 'users',
        localField: 'onlinePractitioners',
        foreignField: '_id',
        as: 'onlinePractitioners',
      },
    });
    stages.push({
      $addFields: {
        appointmentCategoryOrder: {
          $ifNull: ['$appointmentCategoryOrder', []],
        },
        appointmentTypeOrder: {
          $ifNull: ['$appointmentTypeOrder', []],
        },
      },
    });
    stages.push({
      $lookup: {
        from: 'appointmentcategories',
        let: { categoryIds: '$appointmentCategoryOrder' },
        pipeline: [
          {
            $match: {
              $expr: { $in: ['$_id', '$$categoryIds'] },
            },
          },
          {
            $addFields: {
              sort: {
                $indexOfArray: ['$$categoryIds', '$_id'],
              },
            },
          },
          { $sort: { sort: 1 } },
          { $addFields: { sort: '$$REMOVE' } },
        ],
        as: 'appointmentCategoryOrder',
      },
    });
    stages.push({
      $lookup: {
        from: 'appointmenttypes',
        let: { appointmentTypeIds: '$appointmentTypeOrder' },
        pipeline: [
          {
            $match: {
              $expr: { $in: ['$_id', '$$appointmentTypeIds'] },
            },
          },
          {
            $addFields: {
              sort: {
                $indexOfArray: ['$$appointmentTypeIds', '$_id'],
              },
            },
          },
          { $sort: { sort: 1 } },
          { $addFields: { sort: '$$REMOVE' } },
        ],
        as: 'appointmentTypeOrder',
      },
    });

    if (input?.getArchiveDate) {
      stages.push({
        $lookup: {
          from: 'users',
          as: 'practitioners',
          let: { teamMemberIds: '$teamMembersOrder' },

          pipeline: [
            {
              $match: {
                businessId: businessId,
                'role.role': { $eq: 'practitioner' },
              },
            },
            {
              $lookup: {
                from: 'archiveteammemberfroms',
                localField: '_id',
                foreignField: 'userId',
                as: 'archiveTeamMemberFrom',
              },
            },
            {
              $project: {
                userId: '$_id',
                fullName: '$fullName',
                profilePicture: '$profilePicture',
                archiveDate: { $first: '$archiveTeamMemberFrom.archiveDate' },
              },
            },
          ],
        },
      });
    }

    stages.push({
      $addFields: {
        farAheadForOnlineBookingsEndDate: {
          $dateAdd: {
            startDate: new Date(),
            unit: '$farAheadForOnlineBookingsUnit',
            amount: '$farAheadForOnlineBookingsNumber',
          },
        },
      },
    });

    return this.aggregate(stages);
  }
}
