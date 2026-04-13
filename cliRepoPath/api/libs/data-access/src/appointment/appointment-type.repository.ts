import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Model } from 'mongoose';
import { AppointmentType, AppointmentTypeDocument } from './appointment-type.schema';
import { AppointmentTypeListingDto } from '@api/modules/appointments/dto/input/list-appointment-type.dto';
import { toMongoId } from '@app/common/helpers/mongo-helper';
import { ClassTypeStatus } from '@app/common/enum/appointment.enum';

@Injectable()
export class AppointmentTypeRepository extends BaseRepo<AppointmentTypeDocument> {
  constructor(
    @InjectModel(AppointmentType.name)
    private readonly appointmentType: Model<AppointmentTypeDocument>,
  ) {
    super(appointmentType);
  }

  async listAppointmentType(payload: AppointmentTypeListingDto, businessId: string) {
    const { isActive, practitioner } = payload;

    const stages: any = [];

    if (practitioner && practitioner?.length) {
      stages.push({
        $match: {
          practitioner: {
            $in: practitioner.map((id) => toMongoId(id)),
          },
        },
      });
    }

    stages.push(
      {
        $match: {
          businessId: toMongoId(businessId),
          ...(isActive ? { isActive } : {}),
        },
      },

      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          duration: 1,
          status: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$isDraft', true] },
                  then: ClassTypeStatus.Draft,
                },
                {
                  case: { $eq: ['$isActive', false] },
                  then: ClassTypeStatus.Inactive,
                },
              ],
              default: ClassTypeStatus.Live,
            },
          },
          practitioner: 1,
          color: 1,
          businessId: 1,
          multiPractitioner: 1,
          multiPatient: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    );
    if (payload.searchText) {
      const fuzzySearchPattern = payload.searchText.split('').join('\\s*');

      stages.push({
        $match: {
          title: {
            $regex: fuzzySearchPattern,
            $options: 'i',
          },
        },
      });
    }

    return await this.aggregatePaginate(stages, payload.pageMeta);
  }
}
