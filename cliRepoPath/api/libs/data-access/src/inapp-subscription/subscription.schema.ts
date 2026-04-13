import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { PurchasePlatform } from './enum/subscription-platform.enum';

export type SubscriptionDocument = Subscription & mongoose.Document;

@Schema({ timestamps: true })
@ObjectType()
export class Subscription {
  @Field()
  _id: string;

  @Prop({
    type: String,
    enum: PurchasePlatform,
  })
  @Field(() => PurchasePlatform)
  purchasePlatform: PurchasePlatform;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Field()
  userId: string;

  @Prop()
  @Field()
  istrailPeriod: boolean;

  @Prop()
  @Field()
  packageName: string;

  @Prop()
  @Field()
  productId: string;

  @Prop()
  @Field()
  receipt: string;

  @Prop()
  @Field()
  originalTransactionId: string;

  @Prop()
  @Field()
  transactionId: string;

  @Prop()
  @Field()
  autoRenewStatus: boolean;

  @Prop()
  @Field()
  purchaseDate: Date;

  @Prop()
  @Field()
  expirationDate: Date;

  @Prop()
  @Field()
  cancellationDate?: Date;

  @Prop()
  @Field()
  subscriptionStatus: boolean;

  @Prop()
  @Field()
  environment: string;

  @Prop()
  @Field({ nullable: true })
  notificationType: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
