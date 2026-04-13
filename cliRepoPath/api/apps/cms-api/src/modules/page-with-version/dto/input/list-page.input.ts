import { BasePaginationParams } from '@app/common/dto/input/base-pagination.dto';
import { PageTypeWithVersion } from '@app/data-access/pageWithVersion/pageWithVersion.enum';
import { Field, InputType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GetAllPagesInputDTO
 * @typedef {GetAllPagesInputDTO}
 */
@InputType()
export class GetAllPagesWithVersionInputDTO extends BasePaginationParams {
  @Field(() => PageTypeWithVersion, { nullable: true })
  pageType?: PageTypeWithVersion;
}
