import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateEmailBuilderInput {
  @Field({ nullable: true })
  communicationId: string;

  @Field()
  @IsNotEmpty()
  jsonContent: string;

  @Field()
  @IsNotEmpty()
  htmlContent: string;

  @IsNotEmpty()
  @Field()
  action: string;

  @IsNotEmpty()
  @Field()
  name: string;

  @IsOptional()
  @Field({ nullable: true })
  _id: string;
}

@InputType()
export class UpdateActiveStatusOfEmailTemplateDTO {
  @Field()
  @IsNotEmpty()
  @IsMongoId()
  templateId: string;

  @Field()
  @IsNotEmpty()
  status: string;
}
