import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AdminStatus } from './admin-status.enum';
import * as mongoose from 'mongoose';
import { Role } from '../roles';

export type AdminDocument = Admin & mongoose.Document;

@Schema({ timestamps: true })
export class Admin {
  _id: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Role',
    required: false,
  })
  roles: string[];

  roleDetails?: Role[];

  @Prop({ default: 0 })
  invalidLoginCount: number;

  @Prop({
    type: String,
    required: true,
    enum: AdminStatus,
    default: AdminStatus.PENDING,
  })
  status: AdminStatus;

  @Prop()
  phone: string;

  @Prop()
  profileImage: string;

  @Prop()
  otpBase32?: string;

  @Prop()
  otpAuthUrl?: string;

  @Prop()
  enabled2FA?: boolean;

  @Prop()
  verified2FA?: boolean;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.virtual('roleDetails', {
  ref: 'Role',
  localField: 'roles',
  foreignField: '_id',
  justOne: false,
});

AdminSchema.index({ title: 'text', 'attributes.attribute_value': 'text' });
