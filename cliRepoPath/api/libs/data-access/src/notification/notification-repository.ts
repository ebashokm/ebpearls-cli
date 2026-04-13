import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from '../repository/base.repo';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationRepository extends BaseRepo<NotificationDocument> {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {
    super(notificationModel);
  }

  async getAllByUserId(userId: string, findOptions) {
    const { timestamp, limit, skip } = findOptions;
    const findQuery = {
      userId,
    };
    if (timestamp) {
      findQuery['createdAt'] = { $gt: timestamp };
    }
    return this.findWithPaginate(findQuery, { limit, skip, orderBy: 'createdAt', order: 'desc' });
  }
}
