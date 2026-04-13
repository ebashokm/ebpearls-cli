import { BasePaginationParams } from '@app/common/dto/input/base-pagination.dto';
import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class RecordingListInput extends BasePaginationParams {
  @Field({ nullable: true })
  fromDate?: Date;

  @Field({ nullable: true })
  toDate?: Date;

  @Field({ nullable: true })
  timeZone?: string;
}
