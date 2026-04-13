import { CreateFeedInput } from './create-feed.input';
import { InputType, PartialType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateFeedInput
 * @typedef {UpdateFeedInput}
 * @extends {PartialType(CreateFeedInput)}
 */
@InputType()
export class UpdateFeedInput extends PartialType(CreateFeedInput) {}
