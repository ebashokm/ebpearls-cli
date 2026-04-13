import { InputType, PartialType } from '@nestjs/graphql';
import { CreateAdvancePageDTO } from './create-advance-page-dto';

@InputType()
export class UpdateAdvancePageDTO extends PartialType(CreateAdvancePageDTO) {}
