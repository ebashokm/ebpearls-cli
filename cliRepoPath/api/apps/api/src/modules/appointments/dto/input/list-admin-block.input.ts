import { PagMetaDTO } from '@app/common/dto/input/base-pagination.dto';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class ListAdminBlocksInput {
  @Field()
  pageMeta: PagMetaDTO;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  searchText?: string;

  @Field({ nullable: true })
  showOnlyActive?: boolean;
}
