import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type TaxonomyDocument = Taxonomy & mongoose.Document;

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
class Taxon {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  uuid: string;

  @Prop()
  metaTitle: string;

  @Prop()
  metaDescription: string;

  @Prop()
  metaKeywords: string;

  @Prop({ required: false })
  image: File;

  @Prop()
  description: string;

  @Prop()
  nestedUnder: string;

  @Prop()
  children: [mongoose.Mixed];
}

@Schema({ timestamps: true })
export class Taxonomy {
  @Prop({ required: true })
  name: string;

  @Prop({ type: () => [Taxon] })
  taxons: [Taxon];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const TaxonomySchema = SchemaFactory.createForClass(Taxonomy);
