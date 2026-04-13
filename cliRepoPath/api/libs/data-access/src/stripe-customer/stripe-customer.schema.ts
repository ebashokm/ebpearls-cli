import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IdentityDocument, StripePaymentDetail } from './payment-detail.response';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class StripeCustomer {
  @Prop({ required: true })
  userId: MongooseSchema.Types.ObjectId;
  @Prop({ required: true })
  customerId: string;
  @Prop()
  identityDocuments: IdentityDocument;
  @Prop()
  paymentDetail: StripePaymentDetail;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export type StripeCustomerDocument = StripeCustomer & Document;

export const StripeCustomerSchema = SchemaFactory.createForClass(StripeCustomer);
