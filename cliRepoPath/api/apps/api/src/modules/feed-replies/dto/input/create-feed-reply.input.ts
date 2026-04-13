import { CommentAssetType } from '@app/data-access/feed/enum/comment-asset.enum';
import { InputType, Field } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ReplyAssetInput
 * @typedef {ReplyAssetInput}
 */
@InputType()
export class ReplyAssetInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {CommentAssetType}
   */
  @Field(() => CommentAssetType, { nullable: true })
  type: CommentAssetType;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  url: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateFeedReplyInput
 * @typedef {CreateFeedReplyInput}
 */
@InputType()
export class CreateFeedReplyInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  replyText?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?ReplyAssetInput}
   */
  @Field(() => ReplyAssetInput, { nullable: true })
  assets?: ReplyAssetInput;
}
