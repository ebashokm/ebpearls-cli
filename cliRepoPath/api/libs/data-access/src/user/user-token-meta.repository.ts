import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepo } from '../repository/base.repo';
import { UserTokenMeta, UserTokenMetaDocument } from './user-token-meta.schema';
import { toMongoId } from '@app/common/helpers/mongo-helper';

@Injectable()
export class UserTokenMetaRepository extends BaseRepo<UserTokenMetaDocument> {
  constructor(
    @InjectModel(UserTokenMeta.name)
    private readonly userTokenMetaModel: Model<UserTokenMetaDocument>,
  ) {
    super(userTokenMetaModel);
  }

  async listDevicesForUser(userId: string) {
    return await this.aggregate([
      { $match: { userId: toMongoId(userId), isDeleted: false } },
      {
        $group: {
          _id: '$deviceId',
          lastActiveAt: { $max: '$updatedAt' },
        },
      },
    ]);
  }
}
