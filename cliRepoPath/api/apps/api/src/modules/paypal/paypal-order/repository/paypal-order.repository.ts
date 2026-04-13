import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from '@app/data-access/repository/base.repo';
import { PaypalOrder, PaypalOrderDocument } from '../model/paypal-order.schema';

@Injectable()
export class PaypalOrderRepository extends BaseRepo<PaypalOrderDocument> {
  constructor(
    @InjectModel(PaypalOrder.name)
    private readonly paypalOrderModel: Model<PaypalOrderDocument>,
  ) {
    super(paypalOrderModel);
  }

  async updateOrderStatusById(paypalOrderId: string, status: string) {
    return this.paypalOrderModel.updateOne({ paypalOrderId }, { $set: { status } });
  }
}
