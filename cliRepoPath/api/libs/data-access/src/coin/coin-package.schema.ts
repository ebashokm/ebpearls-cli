import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type CoinPackageDocument = mongoose.Document & CoinPackage;

@Schema({ timestamps: true })
export class CoinPackage {
  @Prop({ type: Number, required: true })
  numberOfCoins: number;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: false })
  appleProductId: string;

  @Prop({ required: false })
  androidProductId: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}
export const CoinPackageSchema = SchemaFactory.createForClass(CoinPackage);
