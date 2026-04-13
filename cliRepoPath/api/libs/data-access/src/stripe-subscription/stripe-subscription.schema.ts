import { StripeSubscriptionStatus } from '@app/common/enum/stripe-subscription.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
export type StripeSubscriptionDocument = StripeSubscription & mongoose.Document;

@Schema({ timestamps: true, autoCreate: true, autoIndex: true })
export class StripeSubscription {
  @Prop({
    required: true,
    unique: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: string;

  @Prop({
    type: Object,
  })
  subscriptionObject?: Record<string, any>;

  @Prop()
  productId: string;

  @Prop()
  priceId: string;

  @Prop({ enum: StripeSubscriptionStatus, type: String })
  status: StripeSubscriptionStatus;

  createdAt?: Date;
  updatedAt?: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}
export const StripeSubscriptionSchema = SchemaFactory.createForClass(StripeSubscription);
