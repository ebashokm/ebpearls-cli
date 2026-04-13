import { InputType, PartialType } from '@nestjs/graphql';
import { CreateFAQDto } from './create-faq.dto';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateFAQDto
 * @typedef {UpdateFAQDto}
 * @extends {PartialType(CreateFAQDto)}
 */
@InputType()
export class UpdateFAQDto extends PartialType(CreateFAQDto) {}
