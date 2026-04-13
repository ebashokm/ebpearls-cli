import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Injectable } from '@nestjs/common';
import { StripeSubscription, StripeSubscriptionDocument } from './stripe-subscription.schema';
import { Model } from 'mongoose';

@Injectable()
export class StripeSubscriptionRepository extends BaseRepo<StripeSubscriptionDocument> {
  constructor(
    @InjectModel(StripeSubscription.name)
    private readonly stripeSubscriptionModel: Model<StripeSubscriptionDocument>,
  ) {
    super(stripeSubscriptionModel);
  }
}
