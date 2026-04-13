import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from './../repository/base.repo';

import { AdminBlock, AdminBlockDocument } from './admin-block.schema';
import { convertStringIdToObjectId } from '@app/common/helpers/genericFunction';

@Injectable()
export class AdminBlockRepository extends BaseRepo<AdminBlockDocument> {
  constructor(
    @InjectModel(AdminBlock.name)
    private readonly adminBlock: Model<AdminBlockDocument>,
  ) {
    super(adminBlock);
  }

  async findAll() {
    return this.adminBlock.find();
  }

  async listAll(input: any, businessId: string) {
    const stages: any = [];
    const businessObjectId = convertStringIdToObjectId(businessId);

    if (input.searchText) {
      stages.push({
        $match: {
          $text: { $search: input.searchText },
          businessId: businessObjectId,
        },
      });
    } else {
      stages.push({
        $match: {
          businessId: businessObjectId,
        },
      });
    }

    if (input?.showOnlyActive) {
      stages.push({
        $match: {
          isActive: true,
        },
      });
    }
    stages.push({
      $sort: {
        isActive: -1,
        name: 1,
      },
    });

    return await this.aggregatePaginate(stages, input.pageMeta);
  }
}
