import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { PaymentMethod, PaymentMethodDocument } from './card.schema';
import { Model } from 'mongoose';

@Injectable()
export class PaymentMethodRepository extends BaseRepo<PaymentMethodDocument> {
  constructor(
    @InjectModel(PaymentMethod.name)
    private readonly paymentMethod: Model<PaymentMethodDocument>,
  ) {
    super(paymentMethod);
  }
}
