import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreatePaypalInput } from './dto/input/create-paypal.input';
import { PaypalSubscriptionResponse } from './dto/response/paypal-subscription.response';
import { PaypalSubscriptionService } from './paypal-subscription.service';

@Resolver(() => PaypalSubscriptionResponse)
export class PaypalSubscriptionResolver {
  constructor(private readonly paypalService: PaypalSubscriptionService) {}

  @Mutation(() => PaypalSubscriptionResponse)
  createPaypalSubscription(@Args('createPaypalInput') createPaypalInput: CreatePaypalInput) {
    return this.paypalService.create(createPaypalInput);
  }
}
