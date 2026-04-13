import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from '@app/data-access/repository/base.repo';
import { SubscriptionPlan, SubscriptionPlanDocument } from './subscription-plan.schema';

@Injectable()
export class SubscriptionPlanRepository extends BaseRepo<SubscriptionPlanDocument> {
  constructor(
    @InjectModel(SubscriptionPlan.name)
    private readonly subscriptionPlanModel: Model<SubscriptionPlanDocument>,
  ) {
    super(subscriptionPlanModel);
  }
}
