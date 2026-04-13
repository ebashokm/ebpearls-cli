import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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
class Customer {
  id: string;
  comment: string;
  image: File;
  name: string;
  location: string;
}

export type TestimonialsDocument = Testimonials & Document;

@Schema({ timestamps: true })
export class Testimonials {
  @Prop({ unique: true })
  text: string;
  @Prop(() => Customer)
  customer: [Customer];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const TestimonialsSchema = SchemaFactory.createForClass(Testimonials);
