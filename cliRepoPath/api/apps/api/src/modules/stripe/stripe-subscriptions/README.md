## Description

 Stripe Subscription Module

## Installation

The Stripe Subscription Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/api/src/modules/stripe/stripe-subscriptions folder

- Remove folowing code from apps/api/src/app.module.ts
```bash
import { StripeSubscriptionModule } from './modules/stripe/stripe-subscriptions/stripe-subscriptions.module';

and StripeSubscriptionModule from import array

and StripeSubscriptionModule from include array of graphql
```