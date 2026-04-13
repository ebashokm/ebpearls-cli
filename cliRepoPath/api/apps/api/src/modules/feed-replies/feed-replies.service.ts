import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateFeedReplyInput } from './dto/input/update-feed-reply.input';
import { CreateFeedReplyInput } from './dto/input/create-feed-reply.input';
import {
  FeedReplyRepository,
  FeedCommentRepository,
  PostLikeRepository,
  FeedRepository,
} from '@app/data-access';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { ListRepliesInFeedInput } from '../feeds/dto/input/list-feeds.input';
import { FeedReplyResponse } from './dto/response/feed-reply.response';
import { I18nService } from 'nestjs-i18n';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedRepliesService
 * @typedef {FeedRepliesService}
 */
@Injectable()
export class FeedRepliesService {
  /**
   * Creates an instance of FeedRepliesService.
   *
   * @constructor
   * @param {FeedReplyRepository} feedReplyRepository
   * @param {FeedCommentRepository} feedCommentRepository
   * @param {FeedRepository} feedRepository
   * @param {PostLikeRepository} postLikeRepository
   */
  constructor(
    private readonly feedReplyRepository: FeedReplyRepository,
    private readonly feedCommentRepository: FeedCommentRepository,
    private readonly feedRepository: FeedRepository,
    private readonly postLikeRepository: PostLikeRepository,
    private readonly i18nService: I18nService,
  ) {}
  /**
   * @description create comment reply
   * @param {string} userId user id
   * @param {CreateFeedReplyInput} createInput comment reply input data
   * @returns
   */
  async create(
    userId: string,
    commentId: string,
    createInput: CreateFeedReplyInput,
  ): Promise<FeedReplyResponse> {
    const { replyText, assets } = createInput;
    try {
      if (!replyText && !assets?.url) {
        throw new BadRequestException(this.i18nService.t('feed_replies.reply_content_required'));
      }
      const comment = await this.feedCommentRepository.findCommentById(commentId, {
        _id: 1,
        feedId: 1,
        replyCount: 1,
      });
      if (!comment) {
        throw new NotFoundException(this.i18nService.t('feed_replies.comment_not_found'));
      }

      const createData = {
        commentId,
        feedId: comment.feedId,
        postedBy: userId,
        ...createInput,
      };

      const reply = await this.feedReplyRepository.create(createData);
      comment.replyCount = (comment?.replyCount || 0) + 1;
      await comment.save();
      await this.feedRepository.updateOne(
        { _id: comment.feedId },
        {
          $inc: {
            commentCount: 1,
          },
        },
      );
      return {
        message: this.i18nService.t('feed_replies.comment_reply_posted'),
        feedReply: reply,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description finds if user has liked the given reply
   * @param {string} userId user id
   * @param {string} replyId reply id
   * @returns {Promise<boolean>}
   */
  async getLikeStatus(userId: string, replyId: string): Promise<boolean> {
    try {
      const replyLike = await this.postLikeRepository.findOne({
        postId: replyId,
        postType: 'reply',
        likedBy: userId,
      });
      return !!replyLike;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Batch like status for replies for a single user.
   */
  async getLikeStatusForMany(userId: string, replyIds: string[]): Promise<Set<string>> {
    try {
      const likes = await this.postLikeRepository.find({
        postId: { $in: replyIds },
        postType: 'reply',
        likedBy: userId,
      });
      const likedIds = new Set<string>();
      for (const l of likes as any[]) {
        likedIds.add(String(l.postId));
      }
      return likedIds;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description find all replies of a comment
   * @param {string} commentId comment id
   * @returns {Promise<FeedReplyResponse>}
   */
  async findAllByCommentId(
    commentId: string,
    input: ListRepliesInFeedInput,
  ): Promise<FeedReplyResponse> {
    const { limit, skip, order, orderBy } = input;
    const selectQuery = 'replyText commentId assets postedBy likeCount createdAt updatedAt';
    try {
      const { data, pagination } = await this.feedReplyRepository.findAllByCommentId(
        commentId,
        selectQuery,
        {
          limit,
          skip,
          orderBy,
          order,
        },
      );
      return {
        message: this.i18nService.t('feed_replies.comment_reply_list'),
        feedReplies: data,
        pagination,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description update reply on comment
   * @param {string} userId user id
   * @param {string } replyId reply id
   * @param {UpdateFeedReplyInput} updateInput update reply input
   * @returns
   */
  async update(
    userId: string,
    replyId: string,
    updateInput: UpdateFeedReplyInput,
  ): Promise<MessageResponse> {
    const { replyText, assets } = updateInput;
    try {
      if (!replyText && !assets?.url) {
        throw new BadRequestException(this.i18nService.t('feed_replies.reply_content_required'));
      }
      const reply = await this.feedReplyRepository.findReplyById(replyId);
      if (!reply) {
        throw new NotFoundException(this.i18nService.t('feed_replies.reply_not_found'));
      }

      if (reply.postedBy?.toString() !== userId.toString())
        throw new ForbiddenException(this.i18nService.t('feed_replies.no_permission_to_update'));

      await this.feedReplyRepository.updateById(replyId, updateInput);
      return { message: this.i18nService.t('feed_replies.reply_updated') };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description delete comment reply
   * @param {string} replyId comment reply id
   * @returns
   */
  async deleteFeedReply(userId: string, replyId: string): Promise<MessageResponse> {
    try {
      const reply = await this.feedReplyRepository.findReplyById(replyId);
      if (!reply) {
        throw new NotFoundException(this.i18nService.t('feed_replies.reply_not_found'));
      }
      if (reply.postedBy?.toString() !== userId.toString()) {
        throw new ForbiddenException(this.i18nService.t('feed_replies.no_permission_to_delete'));
      }
      await this.feedReplyRepository.updateById(replyId, {
        deletedAt: new Date(),
      });
      await Promise.all([
        this.feedCommentRepository.updateOne(
          {
            _id: reply.commentId,
            replyCount: { $gte: 1 },
          },
          {
            $inc: {
              replyCount: -1,
            },
          },
        ),
        this.feedRepository.updateOne(
          {
            _id: reply.feedId,
            commentCount: { $gte: 1 },
          },
          {
            $inc: {
              commentCount: -1,
            },
          },
        ),
      ]);
      return {
        message: this.i18nService.t('feed_replies.reply_deleted_successfully'),
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description add a like in the reply
   * @param {string} userId user id
   * @param {string} replyId reply id
   * @returns {Promise<FeedResponse>}
   */
  async addLike(userId: string, replyId: string): Promise<MessageResponse> {
    try {
      const reply = await this.feedReplyRepository.findReplyById(replyId);
      if (!reply) {
        throw new NotFoundException(this.i18nService.t('feed_replies.reply_not_found'));
      }
      const replyLike = await this.postLikeRepository.findOne({
        postId: replyId,
        postType: 'reply',
      });
      if (replyLike?.likedBy?.includes(userId)) {
        return {
          message: this.i18nService.t('feed_replies.already_liked'),
        };
      }
      await this.postLikeRepository.updateOne(
        { postId: replyId, postType: 'reply' },
        { $push: { likedBy: userId } },
        { upsert: true },
      );
      reply.likeCount = (reply?.likeCount || 0) + 1;
      await reply.save();
      return {
        message: this.i18nService.t('feed_replies.reply_liked'),
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description remove a like in the reply
   * @param {string} userId user id
   * @param {string} replyId reply id
   */
  async removeLike(userId: string, replyId: string): Promise<MessageResponse> {
    try {
      const reply = await this.feedReplyRepository.findReplyById(replyId);
      if (!reply) {
        throw new NotFoundException(this.i18nService.t('feed_replies.reply_not_found'));
      }
      const replyLike = await this.postLikeRepository.findOne({
        postId: replyId,
        postType: 'reply',
      });
      if (!replyLike?.likedBy?.includes(userId)) {
        throw new BadRequestException(this.i18nService.t('feed_replies.unlike_reply'));
      }
      await this.postLikeRepository.updateOne({ postId: replyId }, { $pull: { likedBy: userId } });
      reply.likeCount = reply?.likeCount ? reply.likeCount - 1 : 0;
      await reply.save();
      return {
        message: this.i18nService.t('feed_replies.unlike_reply'),
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
