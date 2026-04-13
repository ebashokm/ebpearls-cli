## Description

Stripe Payment Module

## Installation

The Stripe Payment Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/api/src/modules/stripe/stripe-payment folder

- Remove folowing code from apps/api/src/app.module.ts
```bash
import { StripePaymentModule } from './modules/stripe/stripe-payment/stripe-payment.module';

and StripePaymentModule from import array

and StripePaymentModule from include array of graphql
```