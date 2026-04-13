import { CommentAssetType } from '@app/data-access/feed/enum/comment-asset.enum';
import { InputType, Field } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CommentAssetInput
 * @typedef {CommentAssetInput}
 */
@InputType()
export class CommentAssetInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {?CommentAssetType}
   */
  @Field(() => CommentAssetType, { nullable: true })
  type?: CommentAssetType;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  url?: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateFeedCommentInput
 * @typedef {CreateFeedCommentInput}
 */
@InputType()
export class CreateFeedCommentInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  commentText?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?CommentAssetInput}
   */
  @Field(() => CommentAssetInput, { nullable: true })
  assets?: CommentAssetInput;
}
