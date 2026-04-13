import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type SubscriptionProductDocument = SubscriptionProduct & mongoose.Document;

@Schema()
export class PriceSchema {
  @Prop({ required: true })
  priceId: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  name: string;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

@Schema({ timestamps: true, autoIndex: true })
export class SubscriptionProduct {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  billingCycle: string;

  @Prop({ required: true, unique: true })
  productId: string;

  @Prop()
  description: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop()
  prices: PriceSchema[];

  createdAt: Date;
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const SubscriptionProductSchema = SchemaFactory.createForClass(SubscriptionProduct);
