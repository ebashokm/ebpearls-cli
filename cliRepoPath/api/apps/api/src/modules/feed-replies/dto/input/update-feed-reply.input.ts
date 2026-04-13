import { CreateFeedReplyInput } from './create-feed-reply.input';
import { InputType, PartialType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateFeedReplyInput
 * @typedef {UpdateFeedReplyInput}
 * @extends {PartialType(CreateFeedReplyInput)}
 */
@InputType()
export class UpdateFeedReplyInput extends PartialType(CreateFeedReplyInput) {}
