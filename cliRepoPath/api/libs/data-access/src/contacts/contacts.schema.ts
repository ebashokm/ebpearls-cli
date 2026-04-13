import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ContactStatus } from './contact.enum';

@Schema({})
class PhoneNumber {
  // @Prop({ required: true })
  // countryCode: string;

  @Prop()
  isPhoneRegistered: boolean;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  fullPhoneNumber: string;

  @Prop({ required: true })
  phoneNumberId: string;

  @Prop({ required: false })
  uuid: string;
}

@Schema({ timestamps: true, autoCreate: true, autoIndex: true })
export class Contacts {
  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  })
  userId: string;

  @Prop({ required: true })
  contactId: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ enum: ContactStatus, type: String, default: ContactStatus.ACTIVE })
  status: ContactStatus;

  // @Prop()
  // phoneNumberId: string;

  // @Prop()
  // phoneNumber: string;

  @Prop(() => [PhoneNumber])
  phoneNumbers: PhoneNumber[];

  createdAt?: Date;
  updatedAt?: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}
export type ContactsDocument = Contacts & Document;
export const ContactsSchema = SchemaFactory.createForClass(Contacts);

// Add compound indexes
ContactsSchema.index(
  { userId: 1, deletedAt: 1 },
  { name: 'contacts_user_deleted', background: true },
);

ContactsSchema.index(
  { deviceId: 1, deletedAt: 1 },
  { name: 'contacts_device_deleted', background: true },
);
