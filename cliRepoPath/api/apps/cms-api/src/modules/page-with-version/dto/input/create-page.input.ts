import { PageTypeWithVersion } from '@app/data-access/pageWithVersion/pageWithVersion.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { BaseCreatePage } from './createPage.dto.input';

@InputType()
export class CreatePageWithVersionInput extends BaseCreatePage {
  @Field(() => PageTypeWithVersion)
  @IsNotEmpty()
  pageType: PageTypeWithVersion;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  version: string;
}
