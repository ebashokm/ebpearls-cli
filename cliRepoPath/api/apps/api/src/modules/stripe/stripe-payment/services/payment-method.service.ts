import { PaymentMethodRepository, UsersRepository } from '@app/data-access';
import { StripeService } from '@app/stripe';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentMethodService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly stripeService: StripeService,
  ) {}

  private async getPaymentMethod(paymentMethodId: string, option?: Stripe.RequestOptions) {
    //pvt
    return await this.stripeService.retrievePaymentMethod(paymentMethodId, option);
  }

  async getAllPaymentMethodsOfUser(userDetail) {
    let stripeOptions = null;

    let paymentMethods = [];

    const userPaymentMethods = await this.stripeService.paymentMethodsFormStripe(
      userDetail.stripeCustomer,
      stripeOptions,
      null,
    );

    return [...userPaymentMethods, ...paymentMethods];
  }

  async createAndMakeDefaultPaymentMethod(
    paymentMethodId: string,
    user: any,
    option?: Stripe.RequestOptions,
  ) {
    if (!user?.stripeCustomerId) {
      const customer = await this.stripeService.createCustomer({
        description: `cus-${user._id.toString()}`,
      });
      user.stripeCustomerId = customer.id;
    }

    const paymentMethod = await this.getPaymentMethod(paymentMethodId, option);
    const existingCard = await this.paymentMethodRepository.findOne({
      userId: user._id,
    });

    if (!existingCard) {
      await this.userRepository.updateOne(
        { _id: user._id, defaultPaymentMethod: null },
        {
          defaultPaymentMethod: paymentMethodId,
        },
      );

      await this.stripeService.updateCustomer(
        user?.stripeCustomerId,
        {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        },
        option,
      );
    }

    return await this.paymentMethodRepository.create({
      userId: user._id,
      paymentMethodId: paymentMethod?.id,
      paymentMethod: paymentMethod?.card?.brand ?? 'bank',
      country: paymentMethod?.card?.country,
      exp_month: paymentMethod?.card?.exp_month,
      exp_year: paymentMethod?.card?.exp_year,
      fingerprint: paymentMethod?.card?.fingerprint,
      funding: paymentMethod?.card?.funding,
      last4: paymentMethod?.card?.last4,
      metadata: paymentMethod?.metadata,
      name: paymentMethod?.billing_details?.name,
      is_default_source: !existingCard,
    });
  }
}
