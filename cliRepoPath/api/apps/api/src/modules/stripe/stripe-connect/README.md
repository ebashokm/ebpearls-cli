## Description

Stripe Connect Module

## Installation

Stripe Connect Module module come with initial setup of Ebtheme. It is used for payout by stripe. It handle express account, standard account and custom account for stripe connect. Stripe custom account has two ways. Either you can use stripe onboarding method or use custom form to update KYC. If you do not need this module, Follow these steps.

#### configuration
apps/api/src/modules/stripe/stripe-connect/constant/stripe-connect.ts
Update PORTAL_URI according to your frontend site url

In stripe webhook, add webhook for stripe connect with APIURL/stripe-webhook/connect-account

#### Steps

- Remove apps/api/src/modules/stripe/stripe-connect

- Remove apps/api/src/i18n/en/stripe_connect.json
and same file from other language folders

- Remove folowing code from apps/api/src/app.module.ts
```bash
import { StripeConnectModule } from './modules/stripe/stripe-connect/stripe-connect.module';


and StripeConnectModule from import array

and StripeConnectModule from include array of graphql
```

### Methods
- createCustomStripeAccount
Used for creating stripe connect custom account from custom form
- generateCustomAccountOnboardingLink
Used to generate link for creating stripe connect custom account for stripe onboarding
- generateAccountOnboardingLink
Used to generate link for creating stripe connect express or standard account for stripe onboarding
- addUserBankAccount
For adding bank account in stripe connect. One connect account may have multiple external accounts for payout
- deleteUserBankAccount
For deleting bank account in stripe connect. One connect account may have multiple external accounts for payout
- deleteStripeConnectAccount
For deleting stripe connect account of business
- getUserStripeAccountDetails
For getting detail of stripe connect account