import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionLog, SubscriptionLogDocument } from './subscription-log.schema';
import { BaseRepo } from './../repository/base.repo';

@Injectable()
export class SubscriptionLogRepository extends BaseRepo<SubscriptionLogDocument> {
  constructor(
    @InjectModel(SubscriptionLog.name)
    private readonly subscriptionLogModel: Model<SubscriptionLogDocument>,
  ) {
    super(subscriptionLogModel);
  }
}
