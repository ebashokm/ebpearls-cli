import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type MenuDocument = Menu & mongoose.Document;

enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

enum Position {
  HEADER = 'header',
  FOOTER = 'footer',
}

@Schema({})
class File {
  @Prop()
  name: string;
  @Prop()
  objectKey: string;
  @Prop()
  contentType: string;
  @Prop({ nullable: true })
  url: string;
}

@Schema({})
class MenuItem {
  @Prop({ required: false })
  id: string;
  @Prop({ required: false })
  name: string;
  @Prop({ required: false })
  icon: string;
  @Prop({ required: false })
  link: string;
  @Prop({
    type: [
      {
        id: { type: String },
        name: { type: String },
        link: { type: String },
        linkType: { type: String },
        iconType: { type: String },
        icon: { type: String },
        index: { type: Number },
      },
    ],
  })
  children: {
    id: string;
    name: string;
    linkType: string;
    link: string;
    iconType: string;
    icon: string;
    index: number;
  }[];
}

@Schema({ timestamps: true })
export class Menu {
  @Prop({ required: true })
  title: string;

  @Prop({ type: () => File, required: false })
  logo: File;

  @Prop()
  imageAltText: string;

  @Prop({
    required: true,
    default: 'inactive',
    enum: [Status.ACTIVE, Status.INACTIVE],
  })
  status: string;

  @Prop({
    required: true,
    default: 'header',
    enum: [Position.HEADER, Position.FOOTER],
  })
  menuPosition: string;

  @Prop({ type: () => [MenuItem] })
  menuItems: [MenuItem];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
MenuSchema.index({ pageType: 'text' });
