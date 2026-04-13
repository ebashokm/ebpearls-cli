import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IAPEnvType } from '@app/common/enum/iap-env.enum';
import { PurchasePlatform } from '../inapp-subscription/enum/subscription-platform.enum';

export type CoinPurchaseDocument = mongoose.Document & CoinPurchase;

@Schema({ timestamps: true, autoIndex: true })
export class CoinPurchase {
  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  userId: string;

  @Prop({ type: String, required: true, enum: PurchasePlatform })
  purchasePlatform: PurchasePlatform;

  @Prop()
  receipt: string;

  @Prop()
  productId: string;

  @Prop({ required: true })
  originalTransactionId: string;

  @Prop()
  transactionId: string;

  @Prop()
  purchaseDate: Date;

  @Prop()
  coins: number;

  @Prop({ type: String })
  environment: IAPEnvType;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const CoinPurchaseSchema = SchemaFactory.createForClass(CoinPurchase);
