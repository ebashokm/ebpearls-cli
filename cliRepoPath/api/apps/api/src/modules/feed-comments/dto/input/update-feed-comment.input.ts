import { CreateFeedCommentInput } from './create-feed-comment.input';
import { InputType, PartialType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateFeedCommentInput
 * @typedef {UpdateFeedCommentInput}
 * @extends {PartialType(
 *   CreateFeedCommentInput,
 * )}
 */
@InputType()
export class UpdateFeedCommentInput extends PartialType(
  CreateFeedCommentInput,
) {}
