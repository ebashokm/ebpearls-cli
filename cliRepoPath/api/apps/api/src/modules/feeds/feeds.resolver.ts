import { Resolver, Query, Mutation, Args, Parent, ResolveField, Context } from '@nestjs/graphql';
import { FeedsService } from './feeds.service';
import { CreateFeedInput } from './dto/input/create-feed.input';
import { UpdateFeedInput } from './dto/input/update-feed.input';
import { UseGuards } from '@nestjs/common';
import { AuthUserGuard } from '../../guards/auth.user.guard';
import { LoginDetail } from '../auth/decorator/login.decorator';
import { FeedEntity, FeedResponse } from './dto/response/feed.response';
import { ListFeedsInput } from './dto/input/list-feeds.input';
import { ParseObjectIdPipe } from '@app/common/pipe/parse-mongoid.pipe';
import { UserProfileResponse } from '../../common/dto/user.response';
import { UsersService } from '../users/users.service';
import { TermsGuard } from '@api/guards/terms.guard';
import { GqlContext } from '../../graphql/context.factory';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedsResolver
 * @typedef {FeedsResolver}
 */
@Resolver(() => FeedEntity)
export class FeedsResolver {
  /**
   * Creates an instance of FeedsResolver.
   *
   * @constructor
   * @param {FeedsService} feedsService
   * @param {UsersService} usersService
   */
  constructor(
    private readonly feedsService: FeedsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {CreateFeedInput} body
   * @returns {Promise<FeedResponse>}
   */
  @Mutation(() => FeedResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async createFeed(@LoginDetail() loginDetail, @Args('body') body: CreateFeedInput) {
    return this.feedsService.create(loginDetail.userId, body);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {UpdateFeedInput} body
   * @param {*} loginDetail
   * @returns {Promise<FeedResponse>}
   */
  @Mutation(() => FeedResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async updateFeed(
    @Args('id', new ParseObjectIdPipe()) id: string,
    @Args('body') body: UpdateFeedInput,
    @LoginDetail() loginDetail,
  ) {
    return this.feedsService.update(loginDetail.userId, id, body);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {ListFeedsInput} input
   * @returns {Promise<FeedResponse>}
   */
  @Query(() => FeedResponse, { name: 'feedList' })
  @UseGuards(AuthUserGuard, TermsGuard)
  async findAll(@LoginDetail() loginDetail, @Args('input') input: ListFeedsInput) {
    return this.feedsService.findAllFeeds(loginDetail.userId, input);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {string} id
   * @returns {Promise<FeedResponse>}
   */
  @Query(() => FeedResponse, { name: 'findFeed' })
  @UseGuards(AuthUserGuard, TermsGuard)
  async findOne(@LoginDetail() loginDetail, @Args('id', new ParseObjectIdPipe()) id: string) {
    return this.feedsService.findFeedDetail(loginDetail.userId, id);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {FeedEntity} feed
   * @param {{ userId: any; }} param0
   * @param {*} param0.userId
   * @returns {Promise<boolean>\}
   */
  @ResolveField(() => Boolean)
  async isLiked(@Parent() feed: FeedEntity, @LoginDetail() { userId }, @Context() ctx: GqlContext) {
    const { _id: feedId } = feed;
    return ctx.feedLikeStatusLoader.load({ userId, feedId: String(feedId) });
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {FeedEntity} feed
   * @returns {Promise<any>}
   */
  @ResolveField(() => UserProfileResponse)
  async userDetail(@Parent() feed: FeedEntity, @Context() ctx: GqlContext) {
    const { userId } = feed;
    return ctx.userLoader.load(String(userId));
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {string} id
   * @returns {Promise<FeedResponse>}
   */
  @Mutation(() => FeedResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async deleteFeed(@LoginDetail() loginDetail, @Args('id', new ParseObjectIdPipe()) id: string) {
    return this.feedsService.deleteFeed(loginDetail.userId, id);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {string} id
   * @returns {Promise<FeedResponse>}
   */
  @Mutation(() => FeedResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async likeFeed(@LoginDetail() loginDetail, @Args('feedId', new ParseObjectIdPipe()) id: string) {
    return this.feedsService.addLike(loginDetail.userId, id);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {string} id
   * @returns {Promise<FeedResponse>}
   */
  @Mutation(() => FeedResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async unlikeFeed(
    @LoginDetail() loginDetail,
    @Args('feedId', new ParseObjectIdPipe()) id: string,
  ) {
    return this.feedsService.removeLike(loginDetail.userId, id);
  }
}
