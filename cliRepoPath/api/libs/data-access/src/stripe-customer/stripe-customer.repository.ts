import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StripeCustomer, StripeCustomerDocument } from './stripe-customer.schema';
import { BaseRepo } from './../repository/base.repo';

@Injectable()
export class StripeCustomerRepository extends BaseRepo<StripeCustomerDocument> {
  constructor(
    @InjectModel(StripeCustomer.name)
    private readonly stripeCustomer: Model<StripeCustomerDocument>,
  ) {
    super(stripeCustomer);
  }
}
