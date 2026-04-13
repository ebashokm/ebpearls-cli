import { BadRequestException, Injectable } from '@nestjs/common';
import { StripeCustomerRepository, UsersRepository } from '@app/data-access';

import { StripeService } from '@app/stripe';
import { getDynamicDate } from '@app/common/helpers/genericFunction';
import { I18nService } from 'nestjs-i18n';
import { STRIPE_PAYOUT_INTERVAL } from '@app/stripe/constants';

@Injectable()
export class StripePaymentService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly usersRepo: UsersRepository,
    private readonly stripeCustomerRepo: StripeCustomerRepository,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * @description proceed the payment to the stripe business account
   * @param {string} paymentId the id of the payment
   */
  async proceedStripePayout(userId?: string) {
    try {
      const users = await this.getuserInfo(userId);
      for (const user of users) {
        const connectedAccountId = user?.connectedAccountId;

        if (!connectedAccountId) continue;

        const paymentAmount = 1000; // amount after calculation

        const description = `${this.i18nService.t('stripe_payment.amount_payout_to_user')}: ${user.authProviderId}`;

        const paymentData = {
          amount: Math.round(paymentAmount),
          accountId: connectedAccountId,
          stripeCustomerId: user?.stripeCustomerId,
          userId: user?._id,
          description: 'just a payout',
          currency: 'aud',
          status: 'pending',
        };
        // add source transcation if needed according to requirement
        const accountTransfer = await this.stripeService.createAccumulatedTransfer(
          Math.round(paymentAmount),
          connectedAccountId,
          'Amount transfer to user',
          'aud',
        );
        if (!accountTransfer || accountTransfer?.exception) {
          throw new BadRequestException(
            accountTransfer?.exception?.message ||
              `${this.i18nService.t('stripe_payment.error_during_transferring')} - ${connectedAccountId}`,
          );
        }

        const userPayout = await this.stripeService.createPayout(
          Math.round(paymentAmount),
          connectedAccountId,
          description,
          'aud',
        );

        if (!userPayout || userPayout?.exception) {
          throw new BadRequestException(
            userPayout?.exception?.message ||
              `${this.i18nService.t('stripe_payment.error_during_transferring')} - ${connectedAccountId}`,
          );
        }

        paymentData.status = userPayout?.status;
        // Note: Need to verify this code if needed
        // paymentData.sourceTransactionId = userPayout?.id;
        if (userPayout?.status === 'failed' || userPayout?.status === 'canceled') {
          // Note: Need to verify this code if needed
          // paymentData.failureMessage = userPayout?.failure_message;
          // paymentData.failureCode = userPayout?.failure_code;
        }
        // Note: Need to verify this code if needed
        // await this.userPaymentInvoiceRepositorty.create(paymentData);

        if (userPayout?.status === 'paid') {
          // update product payment status
        }
      }
      return 'Payout success';
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  private async getuserInfo(userId: string) {
    try {
      if (!userId) {
        return await this.getUsersWithDuePayout();
      }
      // generally for individual user testing purpose

      const dueInterval = getDynamicDate(new Date(), STRIPE_PAYOUT_INTERVAL, 'before');
      const user = await this.usersRepo.findOne(
        {
          _id: userId,
        },
        {
          _id: 1,
          authProviderId: 1,
        },
      );

      if (user?.lastPayoutAt > dueInterval) {
        throw new BadRequestException(
          this.i18nService.t('stripe_payment.cannot_request_payout_before_one_week_of_last_payout'),
        );
      }

      const stripeCustomer = await this.stripeCustomerRepo.findOne({
        userId,
      });
      if (!stripeCustomer) {
        throw new BadRequestException(this.i18nService.t('stripe_payment.error_stripe_customer'));
      }

      let users = [];

      users.push({
        ...user.toObject(),
        stripeCustomerId: stripeCustomer?._id,
        connectedAccountId: stripeCustomer?.paymentDetail?.accountId,
      });

      return users;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  async getUsersWithDuePayout() {
    try {
      const dueInterval = getDynamicDate(new Date(), STRIPE_PAYOUT_INTERVAL, 'before');
      const filter = [{ $match: { lastPayoutAt: { $lt: dueInterval } } }];
      const users = await this.usersRepo.getUsersWithDuePayment(filter);
      return users;
    } catch (error: any) {
      throw error;
    }
  }
}
