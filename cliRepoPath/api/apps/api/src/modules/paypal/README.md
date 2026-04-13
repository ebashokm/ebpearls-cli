# Paypal Payment Module

#### This module provides a clean, reusable PayPal core service for handling:

- OAuth token generation

- Order creation

- Order capture

- Vault setup tokens

- Payment tokens (saved cards)

- Listing customer payment methods.

It leverages the official PayPal SDK to ensure robust and secure interactions with PayPal's APIs.

## Installation

```
npm install @paypal/paypal-server-sdk
```

## Environment Variables

```
PAYPAL_OAUTH_CLIENT_ID=your_paypal_client_id
PAYPAL_OAUTH_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENVIRONMENT=sandbox_or_live
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id
PAYPAL_PARTNER_ATTRIBUTION_ID=your_paypal_partner_attribution_id
PAYPAL_MERCHANT_ID=your_paypal_merchant_id
```

## Configuration Options

```
export interface ConfigOptions {
  oAuthClientId: string;
  oAuthClientSecret: string;
  environment: 'sandbox' | 'live';
}

```

## PaypalCoreService Overview

```
@Injectable()
export class PaypalCoreService {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly configOptions: ConfigOptions,
  ) {}
}
```

It initializes the PayPal Client internally using OAuth credentials.

## Usage

```
const order = await this.paypalCoreService.createOrder(orderDetails);

const capture = await this.paypalCoreService.captureOrder(orderId);
```

## Create and Capture Order flow

- `createOrder(body: any)`
  - Creates a PayPal order with the provided details.

  - Returns the created order information including approval link.

  - Example body structure:
    ```
    {
      amount: number;
      currency: string;
      quantity?: number;
      itemName?: string;
    }
    ```

- `captureOrder(orderId: string)`
  - Captures a previously created PayPal order by its ID.
  - Returns the capture result including status and transaction details.
  - Called after the user approves the payment.

  - Usually triggered from frontend confirmation

## OAuth Token Generation

```
async getOauthToken()
```

and returns

```
{
  accessToken: string;
  expiresIn: number;
}
```

- Generates an OAuth token using PayPal credentials
- Used internally by PayPal SDK
- Helpful for debugging or manual token-based flows

## PayPal Vault (Save Payment Methods)

### Create Setup Token

```
async createSetupToken(params: SetupTokenRequest)
```

Used to initiate saving a payment method for future use.

### Create Payment Token

```
async createPaymentToken(params: PaymentTokenRequest)
```

Used after setup approval to store the payment method.

## General Order Flow

1. Frontend requests createOrder
2. Backend calls `createOrder` and returns approval link
3. User is redirected to PayPal to approve payment
4. PayPal redirects back to frontend with order ID
5. Frontend calls `captureOrder` with order ID (on OnApprove event)
6. Backend calls `captureOrder` to finalize payment
7. Payment is verified and database is updated
