import { CreateHomePageTemplateDto } from './create-home-page-template.dto';
import { InputType, PartialType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateHomePageTemplateDto
 * @typedef {UpdateHomePageTemplateDto}
 * @extends {PartialType(
 *   CreateHomePageTemplateDto,
 * )}
 */
@InputType()
export class UpdateHomePageTemplateDto extends PartialType(CreateHomePageTemplateDto) {}
