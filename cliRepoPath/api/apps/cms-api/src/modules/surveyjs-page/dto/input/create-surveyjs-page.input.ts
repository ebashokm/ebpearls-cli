import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';
import { SeoInfoInput } from './../../../page/dto/input/seo-info.dto.input';
import GraphQLJSON from 'graphql-type-json';
import { SurveyJsPageStatus } from '../../enum/surveyjs-page-status.enum';

@InputType()
export class CreateSurveyJsPageInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  slug: string;

  @Field(() => SeoInfoInput, { nullable: true })
  @IsOptional()
  seoTags?: SeoInfoInput;

  @Field({ nullable: true })
  @IsOptional()
  content: string;

  @Field(() => SurveyJsPageStatus, {
    nullable: true,
    defaultValue: SurveyJsPageStatus.INACTIVE,
  })
  status: SurveyJsPageStatus;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsObject()
  @IsOptional()
  elements?: Record<string, any>;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  surveyJson?: string;
}
