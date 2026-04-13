import { BaseResponse } from '@app/common/dto/response/base-response.dto';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuditLogResponse {
  @Field()
  _id: string;

  @Field()
  tableName: string;

  @Field()
  recordId: string;

  @Field()
  action: string;

  @Field()
  changedBy: string;

  @Field(() => Date)
  changedAt: Date;

  @Field({ nullable: true })
  oldValues?: string;

  @Field({ nullable: true })
  newValues?: string;
}

@ObjectType()
export class PaginatedAuditLogResponse extends BaseResponse {
  @Field(() => [AuditLogResponse], { nullable: 'items' })
  data!: AuditLogResponse[];
}
