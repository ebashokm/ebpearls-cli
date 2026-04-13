import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateBankDetailInput } from './create-bank.input';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateBankDetailInput
 * @typedef {UpdateBankDetailInput}
 * @extends {OmitType(
 *   PartialType(CreateBankDetailInput),
 *   ['identityDocumentFront', 'identityDocumentBack'],
 * )}
 */
@InputType()
export class UpdateBankDetailInput extends OmitType(
  PartialType(CreateBankDetailInput),
  ['identityDocumentFront', 'identityDocumentBack'],
) {}
