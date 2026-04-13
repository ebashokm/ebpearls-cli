import { Field, InputType } from '@nestjs/graphql';
import { IsObject, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class SendToQueueInput {
  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsObject()
  @IsOptional()
  data?: any;
}
