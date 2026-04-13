import { Inject, Injectable } from '@nestjs/common';
import { ConfigOptions } from './config/config.options';
import { MODULE_OPTIONS_TOKEN } from './paypal.definition';
import { Logger } from '@nestjs/common';

import {
  CheckoutPaymentIntent,
  Client,
  OAuthAuthorizationController,
  OrderRequest,
  OrdersController,
  PaymentTokenRequest,
  SetupTokenRequest,
  VaultController,
} from '@paypal/paypal-server-sdk';

@Injectable()
export class PaypalCoreService {
  private readonly logger = new Logger(PaypalCoreService.name);
  private client: Client;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private readonly configOptions: ConfigOptions) {
    this.client = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: this.configOptions.oAuthClientId,
        oAuthClientSecret: this.configOptions.oAuthClientSecret,
      },
      environment: this.configOptions.environment,
    });
  }

  async getOauthToken() {
    try {
      const oAuthAuthorizationController = new OAuthAuthorizationController(this.client);

      const buffer = Buffer.from(
        `${this.configOptions.oAuthClientId}:${this.configOptions.oAuthClientSecret}`,
      ).toString('base64');
      const authorization = `Basic ${buffer}`;
      const fields = {
        response_type: 'id_token',
      };
      const response = await oAuthAuthorizationController.requestToken({ authorization }, fields);
      this.logger.log('getOauthToken', response);
      return {
        ...response.result,
        expiresIn: Number(response.result.expiresIn),
      };
    } catch (error) {
      this.logger.error('Failed to generate oauth token', error);
      throw error;
    }
  }

  async createOrder(body: any) {
    try {
      const ordersController = new OrdersController(this.client);

      const response = await ordersController.createOrder({
        body: {
          intent: CheckoutPaymentIntent.Capture,
          purchaseUnits: [
            {
              referenceId: `${Date.now()}-${body.itemName}`,
              customId: body.userId,
              amount: {
                currencyCode: body.currency,
                value: String(body.amount),
                breakdown: {
                  itemTotal: {
                    currencyCode: body.currency,
                    value: String(body.amount),
                  },
                },
              },
              description: 'Payment',
              ...(body.itemName && {
                items: [
                  {
                    name: body.itemName,
                    quantity: body.quantity ? String(body.quantity) : '1',
                    unitAmount: {
                      currencyCode: body.currency,
                      value: String(body.amount),
                    },
                  },
                ],
              }),
            },
          ],
          applicationContext: {
            returnUrl: `http://localhost:3000/payment/success`,
            cancelUrl: `http://localhost:3000/payment/cancel`,
            brandName: 'Ebthemes',
          },
        },
      });
      this.logger.debug('createOrder', response);
      return response.result;
    } catch (error) {
      this.logger.error('Failed to create PayPal order', error);
      throw error;
    }
  }

  async captureOrder(orderId: string) {
    try {
      const ordersController = new OrdersController(this.client);

      const response = await ordersController.captureOrder({ id: orderId });

      this.logger.debug('captureOrder', response);
      return response.result;
    } catch (error) {
      this.logger.error('Failed to capture PayPal order', error);
      throw error;
    }
  }

  async createSetupToken(params: SetupTokenRequest) {
    try {
      const vaultController = new VaultController(this.client);

      const body: SetupTokenRequest = {
        ...params,
      };

      const response = await vaultController.createSetupToken({ body: body });
      this.logger.debug('createSetupToken', response);
      return response;
    } catch (error) {
      this.logger.error('Failed to create vault token', error);
      throw error;
    }
  }

  async createPaymentToken(params: PaymentTokenRequest) {
    try {
      const vaultController = new VaultController(this.client);

      const body: PaymentTokenRequest = {
        ...params,
      };

      this.logger.log('body', body);
      const response = await vaultController.createPaymentToken({ body: body });
      this.logger.debug('createPaymentToken', response);
      return response;
    } catch (error) {
      this.logger.error('Failed to create vault token', error);
      throw error;
    }
  }

  async listCustomerPaymentTokens(customerId: string) {
    try {
      const vaultController = new VaultController(this.client);

      const response = await vaultController.listCustomerPaymentTokens({ customerId });
      this.logger.debug('listCustomerPaymentTokens', response);
      return response;
    } catch (error) {
      this.logger.error('Failed to create vault token', error);
      throw error;
    }
  }
}
