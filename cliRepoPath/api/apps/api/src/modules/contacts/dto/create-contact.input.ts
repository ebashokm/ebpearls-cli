import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class UploadFileInput {
  @Field()
  file: string;
}

@ObjectType()
export class FileResponse {
  @Field()
  filename: string;

  @Field()
  mimetype: string;

  @Field()
  encoding: string;
}
