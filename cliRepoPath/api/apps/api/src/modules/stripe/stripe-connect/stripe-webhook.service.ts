import { BusinessRepository } from '@app/data-access';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ExternalAccount } from './dto/response/connect-account.response';

@Injectable()
export class StripeWebhookService {
  private readonly stripe: Stripe;

  constructor(private readonly businessRepo: BusinessRepository) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET, {
      apiVersion: process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion,
      typescript: true,
    });
  }

  async handleAction(event: Stripe.Event): Promise<void> {
    const { type: eventType, account: accountId, data } = event;

    switch (eventType) {
      case 'account.updated':
        await this.handleAccountUpdated(data);
        break;

      case 'account.application.deauthorized':
        await this.handleAccountDeauthorized(accountId);
        break;

      case 'account.external_account.created':
        await this.handleExternalAccountCreated(data);
        break;

      case 'account.external_account.deleted':
        await this.handleExternalAccountDeleted(data);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
  }
  async handleExternalAccountDeleted(data: Stripe.AccountExternalAccountDeletedEvent.Data) {
    await this.businessRepo.updateOne(
      {
        'bankDetail.accountId': data.object.account,
      },
      {
        $pull: {
          'bankDetail.externalAccounts': { id: data.object.id },
        },
      },
    );
  }

  async handleExternalAccountCreated(data: Stripe.AccountExternalAccountCreatedEvent.Data) {
    const account = data.object;
    const externalAccount: ExternalAccount = {
      id: account.id,
      object: account.object,
      account: typeof account.account === 'string' ? account.account : account.account.id,
      account_holder_name: 'account_holder_name' in account ? account.account_holder_name : null,
      account_holder_type: 'account_holder_type' in account ? account.account_holder_type : null,
      bank_name: 'bank_name' in account ? account.bank_name : null,
      country: account.country,
      currency: account.currency,
      last4: account.last4, // Removed the incorrect quote
      routing_number: 'routing_number' in account ? account.routing_number : null,
      status: account.status,
      default_for_currency: account.default_for_currency,
    };

    // only add to the list if there is account is not there already
    await this.businessRepo.updateOne(
      {
        'bankDetail.accountId': data.object.account,
      },
      {
        $addToSet: {
          'bankDetail.externalAccounts': externalAccount,
        },
      },
    );
  }

  private async handleAccountUpdated(data: Stripe.AccountUpdatedEvent.Data): Promise<void> {
    console.log(`===Event: Connect Webhook account.updated===`);

    const updatedAccount = data.object;
    if (!updatedAccount) {
      console.log(`${updatedAccount.id}: No Account Found.`);
      return;
    }
    // TODO: for type company type business account how to get verification status
    const linkStatus = this.getLinkStatus(updatedAccount);
    const verificationStatus = updatedAccount?.individual?.verification?.status || 'unknown';
    const logs = JSON.stringify(updatedAccount?.individual?.requirements || {});

    try {
      console.log('===handleConnectAccountUpdate===');

      const externalAccounts: ExternalAccount[] = data.object.external_accounts.data.map(
        (account) => {
          return {
            id: account.id,
            object: account.object,
            account: typeof account.account === 'string' ? account.account : account.account.id,
            account_holder_name:
              'account_holder_name' in account ? account.account_holder_name : null,
            account_holder_type:
              'account_holder_type' in account ? account.account_holder_type : null,
            bank_name: 'bank_name' in account ? account.bank_name : null,
            country: account.country,
            currency: account.currency,
            last4: account.last4, // Removed the incorrect quote
            routing_number: 'routing_number' in account ? account.routing_number : null,
            status: account.status,
            default_for_currency: account.default_for_currency,
          };
        },
      );

      await this.businessRepo.updateOne(
        { 'bankDetail.accountId': updatedAccount.id },
        {
          'bankDetail.logs': logs,
          'bankDetail.accountStatus': linkStatus,
          'bankDetail.verificationStatus': verificationStatus,
          'bankDetail.externalAccounts': externalAccounts,
        },
      );
    } catch (error) {
      console.error('Error in handleConnectAccountUpdate: ', error);
      throw error;
    }
  }

  private getLinkStatus(account: Stripe.Account): string {
    if (account.charges_enabled && account.payouts_enabled) {
      return 'link_completed';
    }
    if (account.details_submitted) {
      return 'details_submitted';
    }
    return 'link_pending';
  }

  private async handleAccountDeauthorized(accountId: string): Promise<void> {
    console.log(`===Event: Connect Webhook account.application.deauthorized===`);
    await this.handleDeleteConnectAccount(accountId);
  }

  private async handleDeleteConnectAccount(accountId: string): Promise<void> {
    try {
      console.log('===handleDeleteConnectAccount===');

      await this.businessRepo.updateOne(
        { 'bankDetail.accountId': accountId },
        { bankDetail: null },
      );
    } catch (error) {
      console.error('Error in handleDeleteConnectAccount: ', error);
      throw error;
    }
  }
}
