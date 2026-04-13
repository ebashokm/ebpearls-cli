import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { CreateSurveyJsPageInput } from './create-surveyjs-page.input';

@InputType()
export class UpdateSurveyJsPageInput extends PartialType(CreateSurveyJsPageInput) {
  @Field(() => String)
  @IsMongoId()
  _id: Types.ObjectId;
}
