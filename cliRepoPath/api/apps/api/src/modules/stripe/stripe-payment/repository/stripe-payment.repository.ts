import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from '@app/data-access/repository/base.repo';
import { StripePayment, StripePaymentDocument } from '../model/stripe-payment.schema';

@Injectable()
export class StripePaymentRepository extends BaseRepo<StripePaymentDocument> {
  constructor(
    @InjectModel(StripePayment.name)
    private readonly stripePayment: Model<StripePaymentDocument>,
  ) {
    super(stripePayment);
  }
}
