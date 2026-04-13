import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose'; // Import Schema from Mongoose for Mixed type
import { FieldType } from './enum/field-type';

/**
 * Description placeholder
 *
 * @export
 * @typedef {SiteSettingDocument}
 */
export type SiteSettingDocument = SiteSetting & Document;

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
  key: string;

  /**
   * Description placeholder
   *
   * @type {string}
   */
  @Prop({ required: true })
  value: string;
}

/**
 * Description placeholder
 *
 * @export
 * @class SiteSetting
 * @typedef {SiteSetting}
 */
@Schema()
export class SiteSetting {
  // @Prop({
  //   ref: 'User',
  //   type: MongooseSchema.Types.ObjectId,
  //   required: false,
  //   default: null,
  // })
  // userId: string;

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

  /**
   * Description placeholder
   *
   * @type {string}
   */
  @Prop({ required: true })
  title: string;

  /**
   * Description placeholder
   *
   * @type {string}
   */
  @Prop({ required: true })
  description: string;

  /**
   * Description placeholder
   *
   * @type {string}
   */
  @Prop({ required: true })
  key: string; // The setting key, e.g., 'language', 'theme', etc.

  // Union type to support both single and multiple values
  /**
   * Description placeholder
   *
   * @type {(string | string[])}
   */
  @Prop({ type: MongooseSchema.Types.Mixed }) // Use MongooseSchema.Types.Mixed for dynamic values
  value: string | string[]; // Can be a single string or an array of strings

  /**
   * Description placeholder
   *
   * @type {FieldType}
   */
  @Prop({
    type: String,
    enum: FieldType,
  })
  fieldType: FieldType;

  // If the field type is 'selectbox', this contains the options
  /**
   * Description placeholder
   *
   * @type {Options[]}
   */
  @Prop({ type: [Options], default: [] })
  options: Options[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

/**
 * Description placeholder
 *
 * @type {*}
 */
export const SiteSettingSchema = SchemaFactory.createForClass(SiteSetting);
