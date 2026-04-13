import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import Stripe from 'stripe';
import * as mongoose from 'mongoose';

export type StripePaymentDocument = StripePayment & mongoose.Document;

@Schema({ timestamps: true })
export class StripePayment {
  @Prop({ required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Object })
  stripeResponse: Stripe.Response<Stripe.PaymentIntent>;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const StripePaymentSchema = SchemaFactory.createForClass(StripePayment);
