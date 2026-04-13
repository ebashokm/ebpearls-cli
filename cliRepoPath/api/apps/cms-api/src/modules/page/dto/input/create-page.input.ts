import { PageType } from '@app/data-access/page/page.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { BaseCreatePage } from './createPage.dto.input';

@InputType()
export class CreatePageInput extends BaseCreatePage {
  @Field(() => PageType)
  @IsNotEmpty()
  pageType: PageType;
}
