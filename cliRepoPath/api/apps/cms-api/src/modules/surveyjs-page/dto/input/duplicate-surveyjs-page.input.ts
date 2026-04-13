import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class DuplicateSurveyJsPageInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  slug: string;
}
