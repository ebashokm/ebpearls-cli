import { Injectable } from '@nestjs/common';
import { CreatePaypalInput } from './dto/input/create-paypal.input';

@Injectable()
export class PaypalSubscriptionService {
  create(createPaypalInput: CreatePaypalInput) {
    return 'This action adds a new paypal';
  }
}
