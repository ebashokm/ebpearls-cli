import { PaginationResponse } from '@app/common/dto/response/pagination.response';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EmailBuilderResponse {
  @Field({ nullable: true })
  communicationId: string;

  @Field({ nullable: true })
  jsonContent: string;

  @Field({ nullable: true })
  htmlContent: string;

  @Field({ nullable: true })
  emailContent: string;

  @Field({ nullable: true })
  businessId: string;

  @Field({ defaultValue: false })
  default: boolean;

  @Field({ nullable: true })
  name: string;

  @Field()
  _id: string;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;

  @Field({ nullable: true })
  status: string;
}

@ObjectType()
export class ListEmailBuilders {
  @Field(() => [EmailBuilderResponse])
  templates: EmailBuilderResponse[];

  @Field()
  message: string;
}

@ObjectType()
export class EmailBuilderTemplateResponse {
  @Field(() => [EmailBuilderResponse])
  data: EmailBuilderResponse[];

  @Field()
  pagination: PaginationResponse;
}
