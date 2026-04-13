import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SubscriptionPlanStatus } from './enum/subscription-plan.enum';
import { BillingCycle } from '@app/common/enum/billing-cycle.enum';

@Schema({ timestamps: true })
export class SubscriptionPlan {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'AUD' })
  currency: string;

  @Prop({ required: true, enum: BillingCycle, type: String })
  interval: BillingCycle;

  @Prop({ default: 0 })
  trialDays: number;

  @Prop({
    required: true,
    enum: SubscriptionPlanStatus,
    default: SubscriptionPlanStatus.ACTIVE,
    type: String,
  })
  status: SubscriptionPlanStatus;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: 0 })
  sortOrder: number;
}

export type SubscriptionPlanDocument = SubscriptionPlan & mongoose.Document;

export const SubscriptionPlanSchema = SchemaFactory.createForClass(SubscriptionPlan);

// Add indexes
SubscriptionPlanSchema.index({ status: 1 });
SubscriptionPlanSchema.index({ interval: 1, status: 1 });
