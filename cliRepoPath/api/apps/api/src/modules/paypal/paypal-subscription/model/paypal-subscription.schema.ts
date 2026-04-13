import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';
import { PaypalSubscriptionStatus } from '../enum/paypal-subscription-status.enum';

export type PaypalSubscriptionDocument = PaypalSubscription & mongoose.Document;

@Schema({ timestamps: true })
export class PaypalSubscription {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: Object,
  })
  subscriptionObject?: object;

  @Prop()
  productId: string;

  @Prop()
  priceId: string;

  @Prop({ enum: PaypalSubscriptionStatus, type: String })
  status: PaypalSubscriptionStatus;
}

export const PaypalSubscriptionSchema = SchemaFactory.createForClass(PaypalSubscription);
