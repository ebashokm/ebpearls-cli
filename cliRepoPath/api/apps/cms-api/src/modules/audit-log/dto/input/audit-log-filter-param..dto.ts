import { BasePaginationParams } from '@app/common/dto/input/base-pagination.dto';
import { AuditLogActionEnum } from '@app/data-access/audit-log';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuditLogFilterParamsDTO extends BasePaginationParams {
  @Field(() => [AuditLogActionEnum], { nullable: true })
  action: AuditLogActionEnum[];

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => [String], { nullable: true })
  changedBy?: string[];

  @Field(() => [String], { nullable: true })
  tables?: string[];
}
