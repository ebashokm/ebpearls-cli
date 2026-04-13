import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { SeoInfoWithVersionInput } from './seo-info.dto.input';
import { PageStatusWithVersion } from '@app/data-access/pageWithVersion/pageWithVersion.enum';

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

  @Field(() => SeoInfoWithVersionInput, { nullable: true })
  seoTags?: SeoInfoWithVersionInput;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  content: string;

  @Field(() => PageStatusWithVersion, {
    nullable: true,
    defaultValue: PageStatusWithVersion.ACTIVE,
  })
  status: PageStatusWithVersion;
}
