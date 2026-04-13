import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@app/common/dto/response/base-response.dto';
import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import GraphQLJSON from 'graphql-type-json';
import { BasePaginationResponse } from '@app/common/dto/response/base-pagination.response';
import { SeoTags } from '@cms-api/modules/page/dto/response/seotags.response';
import { SurveyJsPageStatus } from '../../enum/surveyjs-page-status.enum';

@ObjectType()
export class SurveyJsPage extends BaseEntityResponse {
  @Field()
  title: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  content: string;

  @Field(() => SurveyJsPageStatus, { nullable: true })
  status: SurveyJsPageStatus;

  @Field(() => SeoTags, { nullable: true })
  seoTags: SeoTags;

  @Field({ nullable: true })
  version: string;

  @Field({ nullable: true })
  surveyJson: string;

  @Field(() => GraphQLJSON, { nullable: true })
  elements: Record<string, any>;

  @Field(() => Date, { nullable: true })
  publishedAt?: Date;

  @Field(() => Boolean, { nullable: true })
  isDuplicated: boolean;
}

@ObjectType()
export class SurveyJsPageResponse extends BaseResponse {
  @Field(() => SurveyJsPage, { nullable: true })
  data: SurveyJsPage;
}

@ObjectType()
export class SurveyJsPageListResponse extends BaseResponse {
  @Field(() => [SurveyJsPage], { nullable: true })
  data: SurveyJsPage[];

  @Field(() => BasePaginationResponse, { nullable: true })
  pagination?: BasePaginationResponse;
}
