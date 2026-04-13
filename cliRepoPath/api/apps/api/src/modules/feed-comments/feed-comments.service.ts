import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFeedCommentInput } from './dto/input/create-feed-comment.input';
import { UpdateFeedCommentInput } from './dto/input/update-feed-comment.input';
import {
  FeedCommentRepository,
  FeedReplyRepository,
  FeedRepository,
  PostLikeRepository,
} from '@app/data-access';
import { FeedCommentResponse } from './dto/response/feed-comment.response';
import { ListCommentsInFeedInput } from '../feeds/dto/input/list-feeds.input';
import { UsersService } from '../users/users.service';
import { S3Service, S3_TEMP_FOLDER_NAME } from '@app/common/services/s3';
import { SignedUrlMethod } from '@app/common/enum/signed-url.enum';
import { FeedCommentNotificationHandler } from './handler/notification.handler';
import { FeedStatus } from '@app/data-access/feed/enum/feed-status.enum';
import { FeedCommentNotificationType } from '@app/data-access/feed/enum/notification.enum';
import { I18nService } from 'nestjs-i18n';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedCommentsService
 * @typedef {FeedCommentsService}
 */
@Injectable()
export class FeedCommentsService {
  /**
   * Creates an instance of FeedCommentsService.
   *
   * @constructor
   * @param {UsersService} usersService
   * @param {FeedCommentRepository} feedCommentRepository
   * @param {FeedRepository} feedRepository
   * @param {PostLikeRepository} postLikeRepository
   * @param {FeedReplyRepository} feedReplyRepository
   * @param {S3Service} s3Service
   * @param {FeedCommentNotificationHandler} notificationHandler
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly feedCommentRepository: FeedCommentRepository,
    private readonly feedRepository: FeedRepository,
    private readonly postLikeRepository: PostLikeRepository,
    private readonly feedReplyRepository: FeedReplyRepository,
    private readonly s3Service: S3Service,
    private readonly notificationHandler: FeedCommentNotificationHandler,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * @description create feed comment
   * @param {string} userId user id
   * @param {CreateFeedCommentInput} createData feed comment input data
   * @returns
   */
  async create(
    userId: string,
    feedId: string,
    createInput: CreateFeedCommentInput,
  ): Promise<FeedCommentResponse> {
    const { commentText, assets } = createInput;
    try {
      if (!commentText && !assets?.url) {
        throw new BadRequestException(this.i18nService.t('feed_comments.comment_content_required'));
      }
      const feed = await this.feedRepository.findFeedById(feedId, {
        _id: 1,
        status: 1,
        commentCount: 1,
        userId: 1,
      });
      if (!feed || feed?.status !== FeedStatus.PUBLISHED) {
        throw new BadRequestException(this.i18nService.t('feed_comments.feed_not_found'));
      }
      const createData = {
        feedId,
        postedBy: userId,
        ...createInput,
      };
      const comment = await this.feedCommentRepository.create(createData);
      feed.commentCount = (feed?.commentCount || 0) + 1;
      await feed.save();

      if (assets?.url) {
        const commentAssetKey = `public/feeds/${userId}/${feedId}/comments/${comment._id}/${assets.url}`;
        this.s3Service
          .copyObject(`${S3_TEMP_FOLDER_NAME}/${assets.url}`, commentAssetKey)
          .then((data) => {
            console.log('file copied');
          })
          .catch((error) => {
            console.error(error);
          });

        await this.feedCommentRepository.updateById(comment._id, {
          assets: { type: assets.type, url: commentAssetKey },
        });
      }

      if (String(feed.userId) !== String(userId)) {
        // send push notification to the feed owner
        const commentor = await this.usersService.findById(userId, {
          firstName: 1,
          lastName: 1,
        });
        this.notificationHandler.addPushOnCommentedOnFeed(
          feed.userId,
          `${commentor.firstName} ${commentor.lastName || ''}`,
          {
            type: FeedCommentNotificationType.COMMENT_ON_FEED,
            commentorId: String(userId),
            feedId: String(feedId),
          },
        );
        this.notificationHandler.commentedOnFeed(
          feed.userId,
          `${commentor.firstName} ${commentor.lastName || ''}`,
          {
            commentorId: commentor._id.toString(),
            feedId,
          },
        );
      }
      return {
        message: this.i18nService.t('feed_comments.feed_comment_posted'),
        feedComment: comment,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description update comment on feed
   * @param {string} userId user id
   * @param {string } commentId comment id
   * @param {UpdateFeedCommentInput} updateInput update comment input
   * @returns
   */
  async update(
    userId: string,
    commentId: string,
    updateInput: UpdateFeedCommentInput,
  ): Promise<FeedCommentResponse> {
    const { commentText, assets } = updateInput;
    try {
      if (!commentText && !assets?.url) {
        throw new BadRequestException(this.i18nService.t('feed_comments.comment_content_required'));
      }
      const comment = await this.feedCommentRepository.findCommentById(commentId);
      if (!comment) {
        throw new NotFoundException(this.i18nService.t('feed_comments.comment_not_found'));
      }

      if (comment.postedBy?.toString() !== userId.toString())
        throw new ForbiddenException(this.i18nService.t('feed_comments.no_permission_to_update'));

      const updatedComment = await this.feedCommentRepository.updateById(commentId, updateInput, {
        new: true,
      });
      return {
        message: this.i18nService.t('feed_comments.comment_updated_successfully'),
        feedComment: updatedComment,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description find all comments of a feed
   * @param {string} feedId feed id
   * @param {ListCommentsInFeedInput} input comment list input
   * @returns {Promise<FeedCommentResponse>}
   */
  async findAllByFeedId(
    feedId: string,
    input: ListCommentsInFeedInput,
  ): Promise<FeedCommentResponse> {
    const { limit, skip, order, orderBy } = input;
    const selectQuery =
      'feedId commentText assets postedBy likeCount replyCount createdAt updatedAt';
    try {
      const { data, pagination } = await this.feedCommentRepository.findAllByFeedId(
        feedId,
        selectQuery,
        {
          limit,
          skip,
          order,
          orderBy,
        },
      );

      for (const comment of data) {
        if (comment.assets?.url) {
          comment.assets.url = await this.s3Service.getPreSignedUrl(
            comment.assets.url,
            SignedUrlMethod.GET,
          );
        }
      }

      return {
        message: this.i18nService.t('feed_comments.feed_comment_listed'),
        feedComments: data,
        pagination,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @param {number} id
   * @returns {string}
   */
  findOne(id: number) {
    return `This action returns a #${id} feedComment`;
  }

  /**
   * @description finds if user has liked the given comment
   * @param {string} userId user id
   * @param {string} commentId comment id
   * @returns {Promise<boolean>}
   */
  async getLikeStatus(userId: string, commentId: string): Promise<boolean> {
    try {
      const commentLike = await this.postLikeRepository.findOne({
        postId: commentId,
        postType: 'comment',
        likedBy: userId,
      });
      return !!commentLike;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Batch like status for comments for a single user.
   * Returns a Set of commentIds liked by the user.
   */
  async getLikeStatusForMany(userId: string, commentIds: string[]): Promise<Set<string>> {
    try {
      const likes = await this.postLikeRepository.find({
        postId: { $in: commentIds },
        postType: 'comment',
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
   * @description delete feed comment
   * @param {string} commentId feed comment id
   * @returns
   */
  async deleteFeedComment(userId: string, commentId: string): Promise<FeedCommentResponse> {
    try {
      const comment = await this.feedCommentRepository.findCommentById(commentId);
      if (!comment) {
        throw new NotFoundException(this.i18nService.t('feed_comments.comment_not_found'));
      }
      if (comment.postedBy?.toString() !== userId.toString()) {
        throw new ForbiddenException(this.i18nService.t('feed_comments.no_permission_to_delete'));
      }
      await this.feedCommentRepository.updateById(commentId, {
        deletedAt: new Date(),
      });

      const decreaseCount = comment.replyCount ? comment.replyCount + 1 : 1;

      await Promise.all([
        this.feedReplyRepository.updateMany({ commentId }, { deletedAt: new Date() }),
        this.feedRepository.updateOne(
          { _id: comment.feedId, commentCount: { $gte: 1 } },
          {
            $inc: {
              commentCount: -decreaseCount,
            },
          },
        ),
      ]);

      return {
        message: this.i18nService.t('feed_comments.comment_deleted'),
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description add a like in the comment
   * @param {string} userId user id
   * @param {string} commentId comment id
   * @returns {Promise<FeedResponse>}
   */
  async addLike(userId: string, commentId: string): Promise<FeedCommentResponse> {
    try {
      const comment = await this.feedCommentRepository.findCommentById(commentId);
      if (!comment) {
        throw new NotFoundException(this.i18nService.t('feed_comments.comment_not_found'));
      }
      const commentLike = await this.postLikeRepository.findOne({
        postId: commentId,
        postType: 'comment',
      });
      if (commentLike?.likedBy?.includes(userId)) {
        return {
          message: this.i18nService.t('feed_comments.already_liked'),
        };
      }
      await this.postLikeRepository.updateOne(
        { postId: commentId, postType: 'comment' },
        { $push: { likedBy: userId } },
        { upsert: true },
      );
      comment.likeCount = (comment?.likeCount || 0) + 1;
      await comment.save();
      return {
        message: this.i18nService.t('feed_comments.like_a_comment'),
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description remove a like in the comment
   * @param {string} userId user id
   * @param {string} commentId comment id
   */
  async removeLike(userId: string, commentId: string): Promise<FeedCommentResponse> {
    try {
      const comment = await this.feedCommentRepository.findCommentById(commentId);
      if (!comment) {
        throw new NotFoundException(this.i18nService.t('feed_comments.comment_not_found'));
      }
      const commentLike = await this.postLikeRepository.findOne({
        postId: commentId,
        postType: 'comment',
      });
      if (!commentLike?.likedBy?.includes(userId)) {
        throw new BadRequestException(this.i18nService.t('feed_comments.cannot_unlike_comment'));
      }
      await this.postLikeRepository.updateOne(
        { postId: commentId },
        { $pull: { likedBy: userId } },
      );
      comment.likeCount = comment?.likeCount ? comment.likeCount - 1 : 0;
      await comment.save();
      return {
        message: this.i18nService.t('feed_comments.unliked_comment'),
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
