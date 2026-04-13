import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as fs from 'fs';
import Stripe from 'stripe';
import { STRIPE_API_VERSION, STRIPE_HAS_TRIAL_PERIOD } from './constants';
import {
  CreateBankTokenInput,
  ICreatePrice,
  ICreateSubscriptionProduct,
  StripePayoutResult,
  StripeTransferResult,
} from './stripe.types';

const REQUEST_OPTIONS_PARAMS = {
  timeout: 10000,
  maxNetworkRetries: 10,
};

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET'), {
      apiVersion: this.configService.get('STRIPE_API_VERSION') || STRIPE_API_VERSION,
      typescript: true,
    });
  }
  /**
   * Create stripe customer with user id
   * Other details could be added later
   * @param userId
   * @returns
   */
  async createCustomer(
    data: Stripe.CustomerCreateParams,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    return this.stripe.customers.create(data);
  }

  async getOrCreateCustomer(userId: string, email: string) {
    const customers = await this.stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0];
    }

    return await this.createCustomer({
      email,
      metadata: {
        userId,
      },
    });
  }

  async createSetupIntent(
    data: Stripe.SetupIntentCreateParams,
    options: Stripe.RequestOptions | null = null,
  ) {
    return this.stripe.setupIntents.create(data, options);
  }

  async listPaymentMethod(
    data: Stripe.PaymentMethodListParams,
    options: Stripe.RequestOptions | null = null,
  ) {
    return this.stripe.paymentMethods.list(data, options);
  }

  async paymentMethodsFormStripe(stripeCustomerId: string, option, sharedPaymentsOf = null) {
    const cardList = await this.listPaymentMethod(
      {
        customer: stripeCustomerId,
        limit: 100,
        type: 'card',
      },
      option,
    );

    const bankList = await this.listPaymentMethod(
      {
        customer: stripeCustomerId,
        limit: 100,
        type: 'au_becs_debit',
      },
      option,
    );

    return [
      ...(cardList?.data?.map((card) => ({
        ...card,
        method: {
          paymentMethod: card?.card?.brand ?? '', // Use a fallback value
          ...card?.card,
        },
      })) ?? []), // Ensure it doesn't return undefined

      ...(bankList?.data?.map((bank) => ({
        ...bank,
        method: {
          ...bank?.au_becs_debit,
          paymentMethod: bank?.type ?? '', // Use a fallback value
        },
      })) ?? []), // Ensure it doesn't return undefined
    ];
  }

  async updateCustomer(
    customerId: string,
    data: Stripe.CustomerUpdateParams,
    options: Stripe.RequestOptions | null = null,
  ) {
    return this.stripe.customers.update(
      customerId,
      data,
      options
        ? {
            ...REQUEST_OPTIONS_PARAMS,
            ...options,
          }
        : REQUEST_OPTIONS_PARAMS,
    );
  }

  async deleteCustomer(customerId: string) {
    return this.stripe.customers.del(customerId, {}, REQUEST_OPTIONS_PARAMS);
  }

  async createPaymentMethod(data: Stripe.PaymentMethodCreateParams) {
    return this.stripe.paymentMethods.create(data, REQUEST_OPTIONS_PARAMS);
  }

  async attachPaymentMethod(customerId: string, paymentMethodId: string) {
    return this.stripe.paymentMethods.attach(
      paymentMethodId,
      {
        customer: customerId,
      },
      REQUEST_OPTIONS_PARAMS,
    );
  }

  async detachPaymentMethod(paymentMethodId: string) {
    return this.stripe.paymentMethods.detach(paymentMethodId, {}, REQUEST_OPTIONS_PARAMS);
  }

  async retrievePaymentMethod(
    paymentMethodId: string,
    options: Stripe.RequestOptions | null = null,
  ) {
    return this.stripe.paymentMethods.retrieve(
      paymentMethodId,
      {},
      options
        ? {
            ...REQUEST_OPTIONS_PARAMS,
            ...options,
          }
        : REQUEST_OPTIONS_PARAMS,
    );
  }

  async retrieveCustomerDetail(customerId: string, options: Stripe.RequestOptions | null = null) {
    return this.stripe.customers.retrieve(
      customerId,
      {},
      options
        ? {
            ...REQUEST_OPTIONS_PARAMS,
            ...options,
          }
        : REQUEST_OPTIONS_PARAMS,
    );
  }

  async createSource(customerId: string, sourceId: string) {
    return this.stripe.customers.createSource(
      customerId,
      {
        source: sourceId,
      },
      REQUEST_OPTIONS_PARAMS,
    );
  }

  async makeSourceDefaultOnStripe(customerId: string, paymentMethodId: string) {
    return this.stripe.customers.update(
      customerId,
      {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
        expand: ['sources'],
      },
      REQUEST_OPTIONS_PARAMS,
    );
  }

  async createPaymentIntent(data: Stripe.PaymentIntentCreateParams) {
    return this.stripe.paymentIntents.create(data);
  }

  async createEphemeralKey(customerId: string, apiVersion: string) {
    return this.stripe.ephemeralKeys.create(
      {
        customer: customerId,
      },
      {
        apiVersion,
      },
    );
  }

  // Note: In live mode, you can only create account tokens with your application’s publishable key.
  // In test mode, you can only create account tokens with your secret key or publishable key.
  async createBankToken(bankDetails: CreateBankTokenInput) {
    try {
      const token = await this.stripe.tokens.create({
        bank_account: {
          country: 'AU',
          currency: 'AUD',
          account_holder_name: bankDetails.accountName,
          account_holder_type: bankDetails?.accountHolderType || 'individual',
          routing_number: bankDetails.routingNumber,
          account_number: bankDetails.accountNumber,
        },
      });
      return token;
    } catch (error) {
      throw new BadRequestException('Invalid routing number or account number provided');
    }
  }

  async createConnectedAccount(accountData: Stripe.AccountCreateParams) {
    try {
      const connectAc = await this.stripe.accounts.create(accountData);
      return connectAc;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  // https://docs.stripe.com/api/account_links/object
  async createAccountLinks(linkData: Stripe.AccountLinkCreateParams) {
    try {
      return await this.stripe.accountLinks.create(linkData);
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  async createExternalAccount(connectAccountId: string, bankToken: string) {
    try {
      const connectAc = await this.stripe.accounts.createExternalAccount(connectAccountId, {
        external_account: bankToken,
      });
      return connectAc;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  async deleteUserBankAccount(connectAccountId: string, bankId: string) {
    try {
      await this.stripe.accounts.deleteExternalAccount(connectAccountId, bankId);
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  async updateExternalAccount(connectAccountId: string, bankId: string) {
    try {
      await this.stripe.accounts.updateExternalAccount(connectAccountId, bankId, {
        default_for_currency: true,
      });
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  async deleteConnectedAccount(connectAccountId: string) {
    try {
      await this.stripe.accounts.del(connectAccountId);
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  async updateConnectedAccount(accountId: string, accountData: any) {
    try {
      const updatedAcc = await this.stripe.accounts.update(accountId, accountData);
      return updatedAcc;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  async retrieveConnectedAccounts(accountId: string) {
    try {
      return await this.stripe.accounts.listExternalAccounts(accountId);
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  async pipeRsponse(response: any, fileData: any) {
    return new Promise((resolve, reject) => {
      const stream = response.data.pipe(fileData);
      stream.on('finish', async () => {
        resolve(true);
      });
      stream.on('error', (error) => {
        reject(error);
      });
    });
  }

  async uploadIdentityFile(key: string, url: string) {
    const response = await axios({
      url: url,
      method: 'GET',
      responseType: 'stream',
    });

    const filePath = '/tmp/' + key.split('/').pop(); // e.g., "myFile.jpg"
    const fileData = fs.createWriteStream(filePath);

    await this.pipeRsponse(response, fileData);

    const fp = fs.readFileSync(filePath);
    const fileUpload = await this.stripe.files.create({
      purpose: 'identity_document',
      file: {
        data: fp,
        name: key.split('/').pop(),
        type: 'application/octet-stream',
      },
    });
    fs.unlinkSync(filePath);
    return fileUpload;
  }

  /**
   * @description create identity verification session
   * @param {string} userId user id
   * @returns client secret
   */
  async createIdentityVerification(userId: string) {
    const verification = await this.stripe.identity.verificationSessions.create(
      {
        type: 'document',
        options: {
          document: {
            allowed_types: ['driving_license', 'id_card', 'passport'],
          },
        },
        metadata: {
          userId,
        },
      },
      //   {
      //     stripeAccount: 'user stripeAccount',
      //   },
    );
    return verification.client_secret;
  }

  /**
   * @description create a subscription product in stripe account
   * @param createProductData
   * @returns
   */
  async createProduct(createProductData: ICreateSubscriptionProduct) {
    return this.stripe.products.create({
      name: createProductData.name,
      description: createProductData.description,
      active: createProductData.isActive,
    });
  }

  /**
   * @description create a subscription product in stripe account
   * @param createProductData
   * @returns
   */
  async updateProduct(productId: string, updateProductData: Partial<ICreateSubscriptionProduct>) {
    return this.stripe.products.update(productId, {
      name: updateProductData.name,
      description: updateProductData.description,
      active: updateProductData.isActive,
    });
  }

  /**
   * @description create a product price in stripe account
   * @param createPriceData
   * @returns
   */
  async createPrice(priceData: ICreatePrice) {
    return this.stripe.prices.create({
      product: priceData.productId,
      currency: priceData.currency,
      unit_amount: priceData.price * 100,
      active: priceData.isActive,
      ...(priceData.recurringOptions && {
        recurring: {
          interval: priceData.recurringOptions.interval,
          interval_count: priceData.recurringOptions.intervalCount,
          ...(priceData.recurringOptions?.trialPeriodDays && {
            trial_period_days: priceData.recurringOptions.trialPeriodDays,
          }),
        },
      }),
    });
  }

  /**
   * @description delete a product price in stripe account
   * @param productId
   */
  async deletePrices(productId: string) {
    const prices = await this.stripe.prices.list({ product: productId });
    const pricePromise = [];
    // Delete each price by setting 'active' status to false
    for (const price of prices.data) {
      pricePromise.push(
        this.stripe.prices.update(price.id, {
          active: false,
        }),
      );
    }
    await Promise.all(pricePromise);
  }

  /**
   * @description delete a product in stripe account
   * @param productId
   */
  async deleteProduct(productId: string) {
    await this.deletePrices(productId);
    return this.stripe.products.update(productId, {
      active: false,
    });
  }

  /**
   * @description create a subscription for a product
   * @param customerId
   * @param priceId
   * @returns
   */
  async createSubscription(
    customerId: string,
    priceId: string,
    couponCode?: string,
    isRenewing = false,
  ) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        collection_method: 'charge_automatically',
        expand: ['latest_invoice.payment_intent'],
        proration_behavior: 'create_prorations',
        ...(couponCode && { coupon: couponCode }),
        ...(!isRenewing &&
          STRIPE_HAS_TRIAL_PERIOD && {
            // trial_period_days: STRIPE_TRIAL_PERIOD_DAYS,
            trial_end: Date.now() + 1000 * 60 * 5, // 5 min for testing
          }),
      });
      return subscription;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description update/upgrade a subscription
   * @param subscriptionId subscription id to make changes to
   * @param priceId new price id to add to subscription
   * @param subscriptionItemId actual subscription item id to update
   * @returns
   */
  async updateSubscription(
    subscriptionId: string,
    priceId: string,
    subscriptionItemId: string,
    // updateParams?: Stripe.SubscriptionUpdateParams.Item,
  ) {
    try {
      const subscriptionUpdated = await this.stripe.subscriptions.update(subscriptionId, {
        items: [{ id: subscriptionItemId, price: priceId }],
        // can have more params in case of update like plan, quantity, billing threshold, etc.
      });
      return subscriptionUpdated;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description cancel a subscription
   * @param subscriptionId
   * @returns
   */
  async cancelSubscription(subscriptionId: string) {
    try {
      const canceledSubscription = await this.stripe.subscriptions.cancel(subscriptionId);
      return canceledSubscription;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description end subscription trial period
   * @param subscriptionId
   * @returns
   */
  async endSubscriptionTrial(subscriptionId: string) {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        trial_end: 'now',
      });
      return subscription;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * create payout to business account
   * @param {number} amount amount in cent to be transfered
   * @param {string} destination destination account id
   * @param {string} description  description
   * @param {string} currency currency
   * @returns
   */
  async createPayout(
    amount: number,
    destination: string,
    description?: string,
    currency?: string,
  ): Promise<StripePayoutResult> {
    try {
      return await this.stripe.payouts.create(
        {
          amount, // In cent
          description,
          currency,
        },
        {
          stripeAccount: destination,
          ...REQUEST_OPTIONS_PARAMS,
        },
      );
    } catch (e) {
      return {
        exception: e,
      };
    }
  }

  /**
   * create accumulated transfer
   * Assuming transaction will be accumulated and transfered to avoid stripe transfer charge
   * @param {number} amount amount in cent to be transfered
   * @param {string} destination destination account id
   * @param {string} description description
   * @param {string} currency currency
   * @returns
   */
  async createAccumulatedTransfer(
    amount: number,
    destination: string,
    description?: string,
    currency?: string,
  ): Promise<StripeTransferResult> {
    try {
      // There will be insufficent ammount on stripe so will need this in testing purpose
      // await this.stripe.charges.create({
      //   receipt_email: 'test@gmail.com',
      //   amount: 10000000,
      //   currency: 'aud',
      //   source: 'card_1MdXzABvETHe3RKX5GrqqCva', // payment source:- eg: card, bank account
      //   description: 'My First Test Charge (created for API docs at https://www.stripe.com/docs/api)',
      //   customer: 'cus_NN75sO71x0llua',
      // });
      // await this.stripe.paymentIntents.create({
      //   amount: 4000000, //In cent
      //   currency: 'aud',
      //   confirm: true, // imediately confirms after payment
      //   description,
      //   payment_method_types: ['card'],
      //   payment_method: 'pm_1McPhyBvETHe3RKXNtw39y45', // payment source:- eg: card, bank account
      //   customer: 'cus_NNA06JLzPaeSlJ',
      // });
      return await this.stripe.transfers.create(
        {
          amount, //In cent
          destination,
          currency: currency,
          description,
        },
        REQUEST_OPTIONS_PARAMS,
      );
    } catch (e) {
      return {
        exception: e,
      };
    }
  }
}
