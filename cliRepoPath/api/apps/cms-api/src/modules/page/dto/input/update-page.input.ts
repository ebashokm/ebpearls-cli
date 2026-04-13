import { InputType, Field, PartialType, PickType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { toMongoObjectId } from '@app/common/helpers/mongo-helper';
import { CreatePageInput } from './create-page.input';

@InputType()
export class UpdatePageInput extends PartialType(
  PickType(CreatePageInput, ['content', 'status', 'title', 'pageType', 'seoTags', 'slug'] as const),
) {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  @Transform(toMongoObjectId)
  id: string;
}
