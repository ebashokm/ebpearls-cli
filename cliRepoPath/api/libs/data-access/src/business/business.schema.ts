import { BusinessType } from '@api/modules/stripe/stripe-payment/enum/payment-status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export class ExternalAccounts {
  @Prop()
  id: string;

  @Prop()
  object: string;

  @Prop()
  account: string; // account_not_created, pending, link_completed

  @Prop()
  account_holder_name?: string;

  @Prop()
  account_holder_type?: string;

  @Prop()
  bank_name?: string;

  @Prop()
  country: string;

  @Prop()
  currency: string;

  @Prop()
  last4: string;

  @Prop()
  routing_number?: string;

  @Prop()
  status: string;

  @Prop()
  default_for_currency: boolean;
}

class BankDetail {
  @Prop()
  accountId: string;

  @Prop()
  accountType: string;

  // @Prop()
  // sourceId?: string;

  @Prop()
  externalAccounts?: ExternalAccounts[];

  @Prop()
  accountStatus: string; // account_not_created, pending, link_completed

  @Prop()
  verificationStatus: string; // verified, pending, unverified

  @Prop()
  logs?: string;

  @Prop()
  businessType: BusinessType;
}

export type BusinessDocument = Business & mongoose.Document;

@Schema({ timestamps: true })
export class Business {
  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  })
  userId: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  bankDetail: BankDetail;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Locations',
  })
  locations: MongooseSchema.Types.ObjectId[];

  @Prop()
  businessName: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
