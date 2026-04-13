import { CreateEmailTemplateDTO } from './create-email-template.dto';
import { InputType, PartialType, OmitType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateEmailTemplateDTO
 * @typedef {UpdateEmailTemplateDTO}
 * @extends {PartialType(
 *   OmitType(CreateEmailTemplateDTO, ['slug'] as const),
 * )}
 */
@InputType()
export class UpdateEmailTemplateDTO extends PartialType(
  OmitType(CreateEmailTemplateDTO, ['slug'] as const),
) {}
