import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Model, PipelineStage } from 'mongoose';

import { AppointmentInstance, AppointmentInstanceDocument } from './appointment-instance.schema';
import { toMongoId } from '@app/common/helpers/mongo-helper';
import { AppointmentStatus } from '@app/common/enum/appointment.enum';
import { AppointmentRecord } from './types/appointment.types';
import { I18nService } from 'nestjs-i18n';

interface AppointmentFilterProps {
  clientId?: string | null;
  instanceId?: string | null;
}
@Injectable()
export class AppointmentInstanceRepository extends BaseRepo<AppointmentInstanceDocument> {
  constructor(
    private readonly i18nService: I18nService,
    @InjectModel(AppointmentInstance.name)
    private readonly appointmentInstance: Model<AppointmentInstanceDocument>,
  ) {
    super(appointmentInstance);
  }

  async findPrevious(condition) {
    return (
      await this.appointmentInstance.find(condition).sort({ instanceDate: -1 }).limit(1)
    )?.[0];
  }

  async calendarListAppointment(params, user): Promise<AppointmentRecord[]> {
    const { startDate, endDate, coachIds = [] } = params;

    const stages: any = [];

    stages.push({
      $match: {
        status: { $ne: 'cancelled' },
        businessId: user.businessId,
        startTime: { $gte: startDate, $lte: endDate },
        ...(coachIds?.length
          ? { practitionerIds: { $in: coachIds.map((id) => toMongoId(id)) } }
          : {}),
      },
    });

    stages.push({
      $lookup: {
        from: 'appointmenttypes',
        as: 'appointmentType',
        let: { appointmentTypeId: '$appointmentTypeId' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$_id', '$$appointmentTypeId'] } },
          },
          {
            $project: {
              color: '$color',
              title: '$title',
              accessibleLocations: '$accessibleLocations',
            },
          },
        ],
      },
    });

    stages.push({
      $lookup: {
        from: 'adminblocks',
        as: 'adminBlock',
        let: { adminBlockId: '$adminBlockId' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$_id', '$$adminBlockId'] } },
          },
          {
            $project: {
              color: '$color',
              title: '$name',
              duration: '$duration',
            },
          },
        ],
      },
    });

    stages.push({
      $lookup: {
        from: 'users',
        localField: 'clientId',
        foreignField: '_id',
        as: 'client',
      },
    });

    stages.push(
      {
        $lookup: {
          from: 'users',
          localField: 'practitionerIds',
          foreignField: '_id',
          as: 'practitioner',
        },
      },

      // lookup done because no matter what timezoneRegion is saved timezone from location is used to display in calendar if booked from mobile
      {
        $lookup: {
          from: 'locations',
          as: 'locationInfo',
          localField: 'addressId',
          foreignField: '_id',
        },
      },
      {
        $lookup: {
          from: 'timezones',
          as: 'timezoneInfo',
          localField: 'locationInfo.timezoneId',
          foreignField: '_id',
        },
      },
    );

    stages.push({
      $unwind: { path: '$practitioner', preserveNullAndEmptyArrays: true },
    });

    stages.push({
      $project: {
        _id: 1,
        client: 1,
        appointmentType: 1,
        adminBlock: 1,
        instanceDate: 1,
        isUnavailableBlock: 1,
        startTime: 1,
        endTime: 1,
        practitioner: 1,
        timezoneInfo: 1,
        unavailableBlockNote: 1,
        appointmentInvoice: 1,
        status: 1,
        bookedFrom: 1,
        addressId: 1,
        note: 1,
      },
    });

    stages.push({
      $sort: { instanceDate: 1 },
    });

    const result = await this.aggregate(stages);

    const appointments: AppointmentRecord[] = result
      ? result.map(
          (instance) =>
            ({
              _id: instance._id,
              type: 'appointment',
              title: `${
                instance?.isUnavailableBlock && instance?.adminBlock?.[0]?.title
                  ? instance?.adminBlock?.[0]?.title
                  : instance.client?.[0]
                    ? instance.client[0].preferredName
                      ? `${instance.client[0].firstName} (${instance.client[0].preferredName}) ${instance.client[0].lastName}`
                      : instance.client[0].fullName
                    : ''
              }`,
              date: instance.startTime,
              isUnavailableBlock: instance.isUnavailableBlock,
              startTime: instance.startTime,
              endTime: instance.endTime,
              color: instance?.isUnavailableBlock
                ? instance?.adminBlock?.[0]?.color
                : instance?.appointmentType?.[0]?.color,
              user: {
                _id: instance?.practitioner?._id,
                fullName: instance?.practitioner?.fullName,
                profilePicture: instance?.practitioner?.profilePicture,
              },
              client: {
                _id: instance?.client[0]?._id,
                fullName: instance?.client[0]?.fullName,
                firstName: instance?.client[0]?.firstName,
                lastName: instance?.client[0]?.lastName,
                dateOfBirth: instance?.client[0]?.dateOfBirth,
              },
              locationTimezone: instance?.timezoneInfo?.[0]?.name,
              unavailableBlockNote: instance?.unavailableBlockNote,
              fullyPaid: instance?.fullyPaid,
              status: instance?.status,
              bookedFrom: instance?.bookedFrom,
              appointmentNotes: instance?.appointmentNotes,
              address: instance?.addressId,
              note: instance?.note,
              isFirstAppointment: instance?.isFirstAppointment,
              confirmationStatus: instance?.confirmationStatus,
            }) as AppointmentRecord,
        )
      : [];

    return appointments;
  }

  async getAppointmentsInstanceWithDetail({ instanceId, clientId }: AppointmentFilterProps) {
    const instanceDetails = await this.findOne({
      _id: toMongoId(instanceId),
    });

    if (!instanceDetails) {
      this.i18nService.t('common.not_exist', { args: { entity: 'Appointment instance' } });
    }

    const isUnavailableBlock = instanceDetails?.isUnavailableBlock;

    const stages: PipelineStage[] = [];

    if (instanceId) {
      stages.push({
        $match: { _id: toMongoId(instanceId) },
      });
    }

    if (clientId) {
      stages.push({
        $match: { clientId: toMongoId(clientId) },
      });
    }

    stages.push({
      $lookup: {
        from: 'appointmenttypes',
        localField: 'appointmentTypeId',
        foreignField: '_id',
        as: 'appointmentType',
      },
    });
    stages.push({
      $unwind: { path: '$appointmentType', preserveNullAndEmptyArrays: true },
    });

    if (isUnavailableBlock) {
      stages.push({
        $lookup: {
          from: 'adminblocks',
          localField: 'adminBlockId',
          foreignField: '_id',
          as: 'adminBlock',
        },
      });

      stages.push({
        $unwind: { path: '$adminBlock', preserveNullAndEmptyArrays: true },
      });
    }

    stages.push({
      $lookup: {
        from: 'appointments',
        localField: 'appointmentId',
        foreignField: '_id',
        as: 'appointmentInfo',
      },
    });
    stages.push({
      $unwind: { path: '$appointmentInfo', preserveNullAndEmptyArrays: true },
    });

    stages.push({
      $lookup: {
        from: 'appointmentinstances',
        let: {
          clientId: '$clientId',
          businessId: '$businessId',
          instanceDate: '$instanceDate',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$clientId', '$$clientId'] },
                  { $eq: ['$businessId', '$$businessId'] },
                  { $lt: ['$instanceDate', '$$instanceDate'] },
                  { $lt: ['$instanceDate', new Date()] },
                  {
                    $not: {
                      $in: ['$status', [AppointmentStatus.noShow, AppointmentStatus.cancelled]],
                    },
                  },
                ],
              },
            },
          },
          { $sort: { instanceDate: -1 } },
          { $limit: 1 },
          { $project: { instanceDate: 1, timezoneRegion: 1 } },
        ],
        as: 'previousInstance',
      },
    });
    stages.push({
      $lookup: {
        from: 'appointmentinstances',
        let: {
          clientId: '$clientId',
          businessId: '$businessId',
          instanceDate: '$instanceDate',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$clientId', '$$clientId'] },
                  { $eq: ['$businessId', '$$businessId'] },
                  // { $gt: ['$instanceDate', '$$instanceDate'] },
                  { $gt: ['$instanceDate', new Date()] },
                  {
                    $not: {
                      $in: ['$status', [AppointmentStatus.noShow, AppointmentStatus.cancelled]],
                    },
                  },
                ],
              },
            },
          },
          { $sort: { instanceDate: 1 } },
          { $limit: 1 },
          { $project: { instanceDate: 1, timezoneRegion: 1 } },
        ],
        as: 'futureInstance',
      },
    });

    stages.push({
      $lookup: {
        from: 'users',
        localField: 'clientId',
        foreignField: '_id',
        as: 'client',
      },
    });

    stages.push({
      $unwind: { path: '$client', preserveNullAndEmptyArrays: true },
    });

    stages.push({
      $lookup: {
        from: 'businesses',
        localField: 'businessId',
        foreignField: '_id',
        as: 'businessInfo',
      },
    });

    stages.push({
      $unwind: { path: '$businessInfo', preserveNullAndEmptyArrays: true },
    });

    stages.push({
      $lookup: {
        from: 'users',
        localField: 'practitionerIds',
        foreignField: '_id',
        as: 'practitionersData',
      },
    });

    stages.push({
      $addFields: {
        practitioners: {
          $map: {
            input: '$practitionerIds',
            as: 'practitionerId',
            in: {
              $arrayElemAt: [
                '$practitionersData',
                {
                  $indexOfArray: ['$practitionersData._id', '$$practitionerId'],
                },
              ],
            },
          },
        },
      },
    });

    stages.push({
      $unwind: { path: '$practitioner', preserveNullAndEmptyArrays: true },
    });

    stages.push({
      $addFields: {
        appointmentName: {
          $concat: ['$appointmentType.title'],
        },
      },
    });

    stages.push({
      $lookup: {
        from: 'locations',
        localField: 'addressId',
        foreignField: '_id',
        as: 'location',
      },
    });

    stages.push({
      $unwind: {
        path: '$location',
        preserveNullAndEmptyArrays: true,
      },
    });

    stages.push(
      {
        $lookup: {
          from: 'timezones',
          localField: 'location.timezoneId',
          foreignField: '_id',
          as: 'locationTimezoneInfo',
        },
      },
      {
        $unwind: {
          path: '$locationTimezoneInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
    );

    stages.push({
      $lookup: {
        from: 'appointmenttypes',
        localField: 'appointmentTypeId',
        foreignField: '_id',
        as: 'appointmentTypeValue',
      },
    });

    const a = (await instanceId)
      ? (await this.aggregate(stages))?.[0]
      : await this.aggregate(stages);

    return a;
  }

  async getUnavailableAppointmentsOfPractitioners(
    practitionerIds: any,
    appointmentDate: any,
    startTime: any,
    endTime: any,
    appointmentInstanceId: any,
  ) {
    const stages = [];

    const appointmentDateNew = new Date(appointmentDate);

    const year = appointmentDateNew.getUTCFullYear();
    const month = String(appointmentDateNew.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(appointmentDateNew.getUTCDate()).padStart(2, '0');
    const formatedAppointmentDate = `${year}-${month}-${day}`;

    const startHour = new Date(startTime).getUTCHours();
    const endHour = new Date(endTime).getUTCHours();

    const startMinute = new Date(startTime).getUTCMinutes();
    const endMinute = new Date(endTime).getUTCMinutes();
    const startTimeInMinute = startHour * 60 + startMinute;
    const endTimeInMinute = endHour * 60 + endMinute;

    stages.push({
      $match: {
        practitionerIds: {
          $in: practitionerIds.map((practitionerId) => toMongoId(practitionerId)),
        },
      },
    });

    if (appointmentInstanceId && appointmentInstanceId != '') {
      stages.push({
        $match: {
          _id: {
            $nin: [toMongoId(appointmentInstanceId)],
          },
        },
      });
    }

    stages.push({
      $addFields: {
        instanceDateOnly: {
          $dateToString: { format: '%Y-%m-%d', date: '$instanceDate' },
        },
      },
    });

    stages.push({
      $addFields: {
        startHour: {
          $toInt: {
            $dateToString: {
              format: '%H',
              date: '$startTime',
            },
          },
        },
        startMinute: {
          $toInt: {
            $dateToString: {
              format: '%M',
              date: '$startTime',
            },
          },
        },
        endHour: {
          $toInt: {
            $dateToString: {
              format: '%H',
              date: '$endTime',
            },
          },
        },
        endMinute: {
          $toInt: {
            $dateToString: {
              format: '%M',
              date: '$endTime',
            },
          },
        },
      },
    });

    stages.push({
      $addFields: {
        startTimeInMinute: {
          $add: [{ $multiply: ['$startHour', 60] }, '$startMinute'],
        },
        endTimeInMinute: {
          $add: [{ $multiply: ['$endHour', 60] }, '$endMinute'],
        },
      },
    });

    if (appointmentDate) {
      stages.push({
        $match: {
          instanceDateOnly: formatedAppointmentDate,

          $or: [
            {
              $and: [
                { startTimeInMinute: { $gt: startTimeInMinute } },
                { startTimeInMinute: { $lt: endTimeInMinute } },
              ],
            },
            {
              $and: [
                { startTimeInMinute: { $gte: startTimeInMinute } },
                { endTimeInMinute: { $lte: endTimeInMinute } },
              ],
            },
            {
              $and: [
                { endTimeInMinute: { $gt: startTimeInMinute } },
                { endTimeInMinute: { $lt: endTimeInMinute } },
              ],
            },
          ],
        },
      });
    }
    return await this.aggregate(stages);
  }
}
