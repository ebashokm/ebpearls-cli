import { BasePaginationParams } from '@app/common/dto/input/base-pagination.dto';
import { InputType } from '@nestjs/graphql';

@InputType()
export class GetAllSurveyJsPagesInputDTO extends BasePaginationParams {}
