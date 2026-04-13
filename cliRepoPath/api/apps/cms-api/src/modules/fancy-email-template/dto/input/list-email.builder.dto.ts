import { PagMetaDTO } from '@app/common/dto/input/page.dto';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class ListEmailTemplatesDTO {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  searchText?: string;

  @Field()
  pageMeta: PagMetaDTO;
}
