import { BadRequestException, Injectable } from '@nestjs/common';
import { PaypalCoreService } from '@app/paypal-core';
import { PaypalOrderRepository } from './repository';
import { PaypalTransactionType } from './enum/paypal-transaction-type.enum';
import { CreatePaypalOrderInput } from './dto/input/create-paypal-order.input';
import { CreatePaypalOrderResponse } from './dto/response/paypal-order.response';
import { CapturePaypalOrderInput } from './dto/input/capture-paypal-order.input';
import { PaypalOrderStatus } from './enum/paypal-order-status.enum';

@Injectable()
export class PaypalOrderService {
  constructor(
    private readonly paypalCoreService: PaypalCoreService,
    private readonly paypalOrderRepository: PaypalOrderRepository,
  ) {}

  async createOrder(input: CreatePaypalOrderInput, user: any): Promise<CreatePaypalOrderResponse> {
    const { amount, currency, quantity, itemName } = input;
    try {
      const order = await this.paypalCoreService.createOrder({
        amount,
        currency,
        quantity,
        itemName,
        userId: String(user?._id),
      });

      await this.paypalOrderRepository.create({
        userId: String(user?._id),
        status: PaypalOrderStatus.PENDING,
        transactionType: PaypalTransactionType.ONE_TIME_PAYMENT,
        paypalOrderId: order.id,
        amount,
        currency,
        itemName,
        quantity,
        response: order,
      });
      const approvalLink = order.links.find((link: any) => link.rel === 'approve');
      if (!approvalLink) {
        throw new BadRequestException('No approval link found');
      }
      return {
        link: approvalLink.href,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async captureOrder(input: CapturePaypalOrderInput, user: any) {
    const { orderId } = input;
    try {
      const response = await this.paypalCoreService.captureOrder(orderId);

      if (response.status !== 'COMPLETED') {
        await this.paypalOrderRepository.updateOrderStatusById(orderId, 'FAILED');
        throw new BadRequestException('Order not completed');
      }
      await this.paypalOrderRepository.updateOne(
        {
          paypalOrderId: orderId,
        },
        {
          status: 'COMPLETED',
        },
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
