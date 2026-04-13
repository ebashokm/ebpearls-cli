import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BillingCycle } from '@app/common/enum/billing-cycle.enum';
import { PaymentProvider } from '@app/common/enum/payment-provider.enum';
import { ManualSubscriptionStatus } from '../enum/manual-subscription.status.enum';

@Schema({ timestamps: true })
export class ManualSubscription {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, enum: PaymentProvider, type: String })
  paymentProvider: PaymentProvider;

  @Prop({ required: true })
  planId: string;

  @Prop({ required: true })
  planName: string;

  @Prop({ required: true, enum: BillingCycle, type: String })
  billingCycle: BillingCycle;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({
    required: true,
    enum: ManualSubscriptionStatus,
    default: ManualSubscriptionStatus.ACTIVE,
    type: String,
  })
  status: ManualSubscriptionStatus;

  @Prop()
  providerCustomerId: string;

  @Prop()
  stripeInvoiceId: string;

  @Prop()
  paypalOrderId: string;

  @Prop()
  paymentMethodId: string; // NOTE: make this to use reference to PaymentMethod collection

  @Prop()
  autoRenew: boolean;

  @Prop()
  subscriptionStartDate: Date;

  @Prop()
  currentPeriodStart: Date;

  @Prop()
  currentPeriodEnd: Date;

  @Prop()
  trialStart: Date;

  @Prop()
  trialEnd: Date;

  @Prop()
  cancelledAt: Date;

  @Prop()
  subscriptionEndedAt: Date;

  @Prop()
  cancelAtPeriodEnd: boolean; // if true, subscription will be cancelled at the end of the current period, not immediately

  @Prop()
  pausedAt: Date;

  @Prop()
  resumeAt: Date;

  @Prop()
  lastPaymentDate: Date;

  @Prop()
  nextPaymentDate: Date;

  @Prop()
  cancellationReason: string;

  @Prop()
  couponCode: string;
}

export const ManualSubscriptionSchema = SchemaFactory.createForClass(ManualSubscription);

export type ManualSubscriptionDocument = ManualSubscription & mongoose.Document;
