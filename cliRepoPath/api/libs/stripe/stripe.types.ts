import { BillingIntervalEnum } from '@app/common/enum/subscription.enum';
import { BillingCycleEnum } from './subscription-products.enum';
import Stripe from 'stripe';
export enum AccountHolderType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

export enum AccountType {
  CHECKING = 'checking',
  FUTSU = 'futsu',
  SAVING = 'savings',
  TOZA = 'toza',
}

export interface IRecurringOptions {
  interval?: BillingIntervalEnum;
  intervalCount?: number;
  trialPeriodDays?: number;
}
export interface ICreateSubscriptionProduct {
  name: string;
  description?: string;
  isActive?: boolean;
  billingCycle?: BillingCycleEnum;
}

export interface ICreatePrice {
  productId: string;
  currency: string;
  price: number;
  isActive: boolean;
  recurringOptions?: IRecurringOptions;
}

export interface CreateBankTokenInput {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  accountHolderType?: AccountHolderType;
  accountType?: AccountType;
}

export type StripeTransferResult = Partial<Stripe.Response<Stripe.Transfer>> & { exception?: any };
export type StripePayoutResult = Partial<Stripe.Response<Stripe.Payout>> & { exception?: any };
