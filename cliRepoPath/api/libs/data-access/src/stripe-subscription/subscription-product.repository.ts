import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { SubscriptionProduct, SubscriptionProductDocument } from './subscription-product.schema';
import { Model } from 'mongoose';

@Injectable()
export class SubscriptionProductRepository extends BaseRepo<SubscriptionProductDocument> {
  constructor(
    @InjectModel(SubscriptionProduct.name)
    private readonly subscriptionProduct: Model<SubscriptionProductDocument>,
  ) {
    super(subscriptionProduct);
  }

  async getAllSubscriptions(filter, pageMeta) {
    return this.findWithPaginate(filter, pageMeta);
  }
}
