import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';
import { PaypalOrderStatus } from '../enum/paypal-order-status.enum';
import { PaypalTransactionType } from '../enum/paypal-transaction-type.enum';

export type PaypalOrderDocument = PaypalOrder & mongoose.Document;

@Schema({ timestamps: true })
export class PaypalOrder {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: PaypalOrderStatus, type: String })
  status: PaypalOrderStatus;

  @Prop({ required: true, enum: PaypalTransactionType, type: String })
  transactionType: PaypalTransactionType;

  @Prop({ required: true, unique: true, index: true })
  paypalOrderId: string;

  @Prop()
  paypalCaptureId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'PaypalSubscription' })
  subscriptionId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  amount: string;

  @Prop({ required: true, default: 'USD' })
  currency: string;

  @Prop()
  itemName: string;

  @Prop()
  quantity: number;

  @Prop({ type: Object })
  response: any;
}

export const PaypalOrderSchema = SchemaFactory.createForClass(PaypalOrder);

PaypalOrderSchema.index({ userId: 1, createdAt: -1 });
PaypalOrderSchema.index({ status: 1 });
