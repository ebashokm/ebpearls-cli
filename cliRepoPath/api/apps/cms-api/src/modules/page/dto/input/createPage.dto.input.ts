import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { PageStatus } from '../../enum/page-status.enum';
import { SeoInfoInput } from './seo-info.dto.input';

@InputType()
export class BaseCreatePage {
  @Field()
  @IsNotEmpty()
  title: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @Field()
  slug: string;

  @Field(() => SeoInfoInput, { nullable: true })
  seoTags?: SeoInfoInput;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  content: string;

  @Field(() => PageStatus, {
    nullable: true,
    defaultValue: PageStatus.ACTIVE,
  })
  status: PageStatus;
}
