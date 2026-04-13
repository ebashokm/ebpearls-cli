import { LocationType } from '@app/common/enum/location-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
export class AddressType {
  type: LocationType;
  coordinates: [number];
  displayLocation: string;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  postalCode?: string;
}

export type LocationsDocument = Locations & mongoose.Document;

@Schema({ timestamps: true })
export class Locations {
  @Prop()
  name: string;

  @Prop()
  locationAddress: AddressType;

  @Prop({ default: false })
  isPrimary: boolean;

  @Prop({
    required: true,
    ref: 'Business',
    index: true,
  })
  businessId: MongooseSchema.Types.ObjectId;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop({ default: false })
  isImported: boolean;

  @Prop({ default: null })
  locationId: string;

  @Prop({
    required: false,
    ref: 'timezones',
    index: true,
  })
  timezoneId: MongooseSchema.Types.ObjectId;
}

export const LocationsSchema = SchemaFactory.createForClass(Locations);
