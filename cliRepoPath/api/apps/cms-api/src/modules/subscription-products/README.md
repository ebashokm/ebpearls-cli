## Description

Subscription Product Module

## Installation

The Subscription Product Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/cms-api/src/modules/subscription-products folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { SubscriptionProductsModule } from './modules/subscription-products/subscription-products.module';

and SubscriptionProductsModule from import array
```