import { PagMetaDTO } from '@app/common/dto/input/base-pagination.dto';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class AppointmentTypeListingDto {
  @Field()
  pageMeta: PagMetaDTO;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  searchText?: string;

  @Field({
    nullable: true,
    description: 'Status',
    defaultValue: false,
  })
  @IsOptional()
  isActive?: boolean;

  @Field(() => [String], { nullable: true })
  categoryIds: string[];

  @Field(() => [String], { nullable: true })
  accessibleLocations: string[];

  @Field(() => [String], { nullable: true })
  practitioner: string[];
}
