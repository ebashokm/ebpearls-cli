import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { SubscriptionFrequency } from './enum/subscription-frequency.enum';
import { SubscriptionStatus } from './enum/subscription-status.enum';

export type SubscriptionLogDocument = SubscriptionLog & Document;
@Schema({ timestamps: true, autoCreate: true, autoIndex: true })
export class SubscriptionLog {
  _id?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId?: string;

  @Prop({ required: true })
  transactionId?: string;

  @Prop()
  username?: string;

  @Prop({ required: true, set: (value: number) => value.toFixed(2) })
  amount: number;

  @Prop({ required: true, enum: SubscriptionFrequency, type: String })
  subscriptionFrequency: SubscriptionFrequency;

  @Prop({
    required: true,
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
  })
  subscriptionStatus: string;

  @Prop()
  membershipAppliedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const SubscriptionLogSchema = SchemaFactory.createForClass(SubscriptionLog);
