import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from '@app/data-access/repository/base.repo';
import { ManualSubscription, ManualSubscriptionDocument } from '../model';

@Injectable()
export class ManualSubscriptionRepository extends BaseRepo<ManualSubscriptionDocument> {
  constructor(
    @InjectModel(ManualSubscription.name)
    private readonly manualSubscriptionModel: Model<ManualSubscriptionDocument>,
  ) {
    super(manualSubscriptionModel);
  }
}
