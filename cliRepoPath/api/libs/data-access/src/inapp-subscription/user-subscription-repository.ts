import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Subscription, SubscriptionDocument } from './subscription.schema';

@Injectable()
export class UserSubscriptionRepository extends BaseRepo<SubscriptionDocument> {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
  ) {
    super(subscriptionModel);
  }
}
