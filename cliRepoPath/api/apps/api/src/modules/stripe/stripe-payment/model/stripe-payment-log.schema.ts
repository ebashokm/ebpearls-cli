import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { PaymentStatus } from '../enum/payment-status.enum';
import * as mongoose from 'mongoose';

export type StripePaymentLogDocument = StripePaymentLog & mongoose.Document;

@Schema({ timestamps: true })
export class StripePaymentLog {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop()
  username: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  currency: string;

  @Prop()
  paymentMethodTypes: string[];

  @Prop()
  paymentMethodId: string;

  @Prop()
  paymentIntentId: string;

  @Prop({ type: String })
  paymentStatus: PaymentStatus;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const StripePaymentLogSchema = SchemaFactory.createForClass(StripePaymentLog);
