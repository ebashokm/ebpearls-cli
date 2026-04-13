import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StripePaymentLog, StripePaymentLogDocument } from '../model/stripe-payment-log.schema';
import { BaseRepo } from '@app/data-access/repository/base.repo';

@Injectable()
export class StripePaymentLogRepository extends BaseRepo<StripePaymentLogDocument> {
  constructor(
    @InjectModel(StripePaymentLog.name)
    private readonly stripePaymentLog: Model<StripePaymentLogDocument>,
  ) {
    super(stripePaymentLog);
  }

  async findAllPaymentsOfUser(filter, sort, pageMeta) {
    const stages = [...filter];
    if (sort) {
      stages.push({ $sort: { [sort.orderBy]: sort.order === 'asc' ? 1 : -1 } });
    }
    return this.aggregatePaginate(stages, pageMeta);
  }
}
