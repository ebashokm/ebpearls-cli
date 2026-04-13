import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type SettingsDocument = Settings & Document;
import { Schema as MongooseSchema, Document } from 'mongoose'; // Import Schema from Mongoose for Mixed type

/**
 * Description placeholder
 *
 * @export
 * @class Options
 * @typedef {Options}
 */
export class Options {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  @Prop({ required: true })
  value: string;

  /**
   * Description placeholder
   *
   * @type {string}
   */
  @Prop({ required: true })
  label: string;
}

@Schema({ timestamps: true })
export class Settings {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    default: null,
    refPath: 'userModel', // This field tells Mongoose which model to reference dynamically
  })
  userId: string;

  // This field will dynamically determine if the reference is from 'User' or 'AdminUser'
  /**
   * Description placeholder
   *
   * @type {string}
   */
  @Prop({
    type: String,
    required: true,
    enum: ['User', 'Admin'],
  })
  userModel: string; // Either 'User' or 'Admin'

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  fieldType: string;

  @Prop({ required: true })
  order: number;

  // If the field type is 'selectbox', this contains the options
  /**
   * Description placeholder
   *
   * @type {Options[]}
   */
  @Prop({ type: [Options], default: [] })
  options: Options[];

  @Prop(() => [String])
  values: string[];

  @Prop()
  value: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
