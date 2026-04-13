import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFeedInput } from './dto/input/create-feed.input';
import { UpdateFeedInput } from './dto/input/update-feed.input';
import { FeedRepository, PostLikeRepository, Feed } from '@app/data-access';
import { ListFeedsInput } from './dto/input/list-feeds.input';
import { FeedResponse } from './dto/response/feed.response';
import { PartialType } from '../auth/types/partial.type';
import { S3Service, S3_TEMP_FOLDER_NAME } from '@app/common/services/s3';
import { SignedUrlMethod } from '@app/common/enum/signed-url.enum';
import { UsersService } from '../users/users.service';
import { VisibilityType } from '@app/data-access/feed/enum/visibility-type.enum';
import { FeedStatus } from '@app/data-access/feed/enum/feed-status.enum';
import { I18nService } from 'nestjs-i18n';
import { PipelineStage } from 'mongoose';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedsService
 * @typedef {FeedsService}
 */
@Injectable()
export class FeedsService {
  /**
   * Creates an instance of FeedsService.
   *
   * @constructor
   * @param {FeedRepository} feedRepository
   * @param {PostLikeRepository} postLikeRepository
   * @param {UsersService} usersService
   * @param {S3Service} s3Service
   */
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly postLikeRepository: PostLikeRepository,
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * @description feed
   * @param {string} userId user id
   * @param {CreateFeedInput} createFeedInput create data
   * @returns
   */
  async create(userId: string, createFeedInput: CreateFeedInput): Promise<FeedResponse> {
    const { status, caption, assets } = createFeedInput;
    try {
      if (!caption && !assets[0]?.url) {
        throw new BadRequestException(
          this.i18nService.t('feeds.cannot_create_feed_with_no_content'),
        );
      }
      const createData = {
        ...createFeedInput,
        userId,
      };
      if (status === FeedStatus.PUBLISHED) {
        createData['publishedDate'] = new Date();
      }
      const feed = await this.feedRepository.create(createData);

      if (assets?.length && assets[0]?.url) {
        const copyPromises = [];
        const medias = [];
        assets.forEach((asset) => {
          const feedAssetKey = `public/feeds/${userId}/${feed._id}/${asset.url}`;
          medias.push({ type: asset.type, url: feedAssetKey });
          copyPromises.push(
            this.s3Service.copyObject(`${S3_TEMP_FOLDER_NAME}/${asset.url}`, feedAssetKey),
          );
        });

        Promise.all(copyPromises)
          .then((data) => {
            console.log('Copy succeeded');
          })
          .catch((error) => {
            console.log(`Error copying keys: ${error}`);
          });

        await this.feedRepository.updateById(feed._id, { assets: medias });
      }
      return {
        message: this.i18nService.t('feeds.feed_created'),
        feed,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   *
   * @param {string} userId user id
   * @param {ListFeedsInput} listInput list input
   * @returns {Promise<FeedResponse>}
   */

  async findAllFeeds(userId: string, listInput: ListFeedsInput): Promise<FeedResponse> {
    const { searchText, orderBy, order, limit, skip } = listInput;

    try {
      const sort = {
        order,
        orderBy,
      };
      const pageMeta = {
        limit,
        skip,
      };

      const filter = { searchText };
      const { data, pagination } = await this.feedRepository.getAllFeeds(
        userId,
        filter,
        sort,
        pageMeta,
      );

      for (const feed of data) {
        if (feed.assets?.length) {
          const signedUrlPromises = [];

          feed.assets.forEach((asset) => {
            signedUrlPromises.push({
              type: asset.type,
              url: asset.url ? this.s3Service.getPreSignedUrl(asset.url, SignedUrlMethod.GET) : '',
              thumbnails: asset.url ? this.s3Service.getAllThumbnail(asset.url) : [],
            });
          });
          feed.assets = await Promise.all(signedUrlPromises);
        }
      }

      return {
        message: this.i18nService.t('feeds.feed_listed'),
        feeds: data,
        pagination,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description finds if user has liked the given feed
   * @param {string} userId user id
   * @param {string} feedId feed id
   * @returns {Promise<boolean>}
   */
  async getLikeStatus(userId: string, feedId: string): Promise<boolean> {
    try {
      const feedLike = await this.postLikeRepository.findOne({
        postId: feedId,
        postType: 'feed',
        likedBy: userId,
      });
      return !!feedLike;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Batch like status for feeds for a single user.
   * Returns a Set of feedIds liked by the user.
   */
  async getLikeStatusForMany(userId: string, feedIds: string[]): Promise<Set<string>> {
    try {
      const likes = await this.postLikeRepository.find({
        postId: { $in: feedIds },
        postType: 'feed',
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
   * @description find a feed with comments, reply and likes
   * @param {string} userId user id
   * @param {string} feedId feed id
   * @param {UpdateFeedInput} updateFeedInput update feed data
   * @returns
   */
  async findFeedDetail(userId: string, feedId: string): Promise<FeedResponse> {
    try {
      const feed = await this.feedRepository.findFeedById(feedId);
      if (!feed) return this.createResponse(null, 'feeds.feed_not_found');

      if (!this.isFeedAccessible(feed, userId)) {
        return this.createResponse(null, 'feeds.feed_not_found');
      }

      const feedOwner = await this.usersService.findById(feed.userId, { _id: 1 });
      if (!feedOwner) return this.createResponse(null, 'feeds.feed_owner_not_found');

      feed.assets = feed.assets?.length ? await this.generateSignedUrls(feed.assets) : [];

      return this.createResponse(feed, 'feeds.feed_fetched');
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /** Helper function to check feed accessibility */
  private isFeedAccessible(feed: Feed, userId: string): boolean {
    return (
      feed.userId?.toString() === userId?.toString() ||
      (feed.status === FeedStatus.PUBLISHED && feed.visibilityType === VisibilityType.PUBLIC)
    );
  }

  /** Helper function to generate signed URLs */
  private async generateSignedUrls(assets) {
    return Promise.all(
      assets.map((asset) => ({
        type: asset.type,
        url: asset.url ? this.s3Service.getPreSignedUrl(asset.url, SignedUrlMethod.GET) : '',
        thumbnails: asset.url ? this.s3Service.getAllThumbnail(asset.url) : [],
      })),
    );
  }

  /** Helper function to create a standardized response */
  private createResponse(feed: Feed | null, messageKey: string): FeedResponse {
    return {
      feed,
      message: this.i18nService.t(messageKey),
    };
  }

  /**
   * @description update a feed
   * @param {string} userId user id
   * @param {string} feedId feed id
   * @param {UpdateFeedInput} updateFeedInput update feed data
   * @returns {Promise<FeedResponse>}
   */
  async update(
    userId: string,
    feedId: string,
    updateFeedInput: UpdateFeedInput,
  ): Promise<FeedResponse> {
    const { caption, assets, status } = updateFeedInput;
    try {
      const feed = await this.feedRepository.findFeedById(feedId);
      if (!feed) {
        throw new NotFoundException(this.i18nService.t('feeds.feed_not_found'));
      }
      if (feed?.userId.toString() !== userId.toString()) {
        throw new ForbiddenException(this.i18nService.t('feeds.no_permission_to_update'));
      }
      if (!caption && !assets) {
        throw new BadRequestException(
          this.i18nService.t('feeds.cannot_create_feed_with_no_content'),
        );
      }
      const updateData: PartialType<Feed> = { ...updateFeedInput };
      if (feed?.status === FeedStatus.DRAFT && status === FeedStatus.PUBLISHED) {
        updateData.publishedDate = new Date();
      }
      await this.feedRepository.updateById(feedId, updateData);
      return {
        message: this.i18nService.t('feeds.feed_updated'),
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description remove feed
   * @param {string} userId user id
   * @param {string} feedId feed id
   * @returns {Promise<FeedResponse>}
   */
  async deleteFeed(userId: string, feedId: string): Promise<FeedResponse> {
    try {
      const feed = await this.feedRepository.findFeedById(feedId);
      if (!feed) {
        throw new NotFoundException(this.i18nService.t('feeds.feed_not_found'));
      }
      if (feed.userId?.toString() !== userId.toString()) {
        throw new ForbiddenException(this.i18nService.t('feeds.no_permission_to_delete'));
      }
      await this.feedRepository.updateById(feedId, {
        deletedAt: new Date(),
      });
      return {
        message: this.i18nService.t('feeds.feed_deleted'),
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description add a like in the feed
   * @param {string} userId user id
   * @param {string} feedId feed id
   * @returns {Promise<FeedResponse>}
   */
  async addLike(userId: string, feedId: string): Promise<FeedResponse> {
    try {
      const feed = await this.feedRepository.findFeedById(feedId);
      if (!feed) {
        throw new NotFoundException(this.i18nService.t('feeds.feed_not_found'));
      }
      if (feed?.userId?.toString() !== userId?.toString()) {
        if (feed.status !== FeedStatus.PUBLISHED || feed.visibilityType !== VisibilityType.PUBLIC) {
          throw new BadRequestException(this.i18nService.t('feeds.feed_not_published_or_public'));
        }
      }
      const feedLike = await this.postLikeRepository.findOne({
        postId: feedId,
        postType: 'feed',
      });
      if (feedLike?.likedBy?.includes(userId)) {
        return {
          message: this.i18nService.t('feeds.already_liked'),
        };
      }
      await this.postLikeRepository.updateOne(
        { postId: feedId, postType: 'feed' },
        { $push: { likedBy: userId } },
        { upsert: true },
      );
      feed.likeCount = (feed?.likeCount || 0) + 1;
      await feed.save();
      return {
        message: this.i18nService.t('feeds.feed_liked'),
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description remove a like in the feed
   * @param {string} userId user id
   * @param {string} feedId feed id
   */
  async removeLike(userId: string, feedId: string): Promise<FeedResponse> {
    try {
      const feed = await this.feedRepository.findFeedById(feedId);
      if (!feed) {
        throw new NotFoundException(this.i18nService.t('feeds.feed_not_found'));
      }
      if (feed?.userId?.toString() !== userId?.toString()) {
        if (feed.status !== FeedStatus.PUBLISHED || feed.visibilityType !== VisibilityType.PUBLIC) {
          throw new BadRequestException(this.i18nService.t('feeds.feed_not_published_or_public'));
        }
      }
      const feedLike = await this.postLikeRepository.findOne({
        postId: feedId,
        postType: 'feed',
      });
      if (!feedLike?.likedBy?.includes(userId)) {
        throw new BadRequestException(this.i18nService.t('feeds.cannot_unlike_feed'));
      }
      await this.postLikeRepository.updateOne({ postId: feedId }, { $pull: { likedBy: userId } });
      feed.likeCount = feed?.likeCount ? feed.likeCount - 1 : 0;
      await feed.save();
      return {
        message: this.i18nService.t('feeds.feed_unliked'),
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
