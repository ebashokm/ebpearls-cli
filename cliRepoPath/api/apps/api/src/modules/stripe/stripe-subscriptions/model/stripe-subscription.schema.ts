import { StripeSubscriptionStatus } from '@app/common/enum/stripe-subscription.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

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
  subscriptionObject?: object;

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
export type StripeSubscriptionDocument = StripeSubscription & mongoose.Document;
export const StripeSubscriptionSchema = SchemaFactory.createForClass(StripeSubscription);
