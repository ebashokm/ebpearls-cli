## Description

Inapp Subscription Module

## Installation

The Inapp Subscription Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/api/src/modules/subscription folder

- Remove folowing code from apps/api/src/app.module.ts
```bash
import { SubscriptionModule } from './modules/subscription/subscription.module';

and SubscriptionModule from import array

and SubscriptionModule from include array of graphql
```