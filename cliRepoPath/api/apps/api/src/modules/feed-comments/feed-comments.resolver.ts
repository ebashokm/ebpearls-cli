import { Resolver, Query, Mutation, Args, ResolveField, Parent, Context } from '@nestjs/graphql';
import { FeedCommentsService } from './feed-comments.service';
import { CreateFeedCommentInput } from './dto/input/create-feed-comment.input';
import { UpdateFeedCommentInput } from './dto/input/update-feed-comment.input';
import { AuthUserGuard } from '../../guards/auth.user.guard';
import { UseGuards } from '@nestjs/common';
import { FeedCommentEntity, FeedCommentResponse } from './dto/response/feed-comment.response';
import { LoginDetail } from '../auth/decorator/login.decorator';
import { ParseObjectIdPipe } from '@app/common/pipe/parse-mongoid.pipe';
import { UserProfileResponse } from '../../common/dto/user.response';
import { UsersService } from '../users/users.service';
import { ListCommentsInFeedInput } from '../feeds/dto/input/list-feeds.input';
import { TermsGuard } from '@api/guards/terms.guard';
import { GqlContext } from '../../graphql/context.factory';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedCommentsResolver
 * @typedef {FeedCommentsResolver}
 */
@Resolver(() => FeedCommentEntity)
export class FeedCommentsResolver {
  /**
   * Creates an instance of FeedCommentsResolver.
   *
   * @constructor
   * @param {FeedCommentsService} feedCommentsService
   * @param {UsersService} usersService
   */
  constructor(
    private readonly feedCommentsService: FeedCommentsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {string} feedId
   * @param {CreateFeedCommentInput} body
   * @returns {Promise<FeedCommentResponse>}
   */
  @Mutation(() => FeedCommentResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async createFeedComment(
    @LoginDetail() loginDetail,
    @Args('feedId', new ParseObjectIdPipe()) feedId: string,
    @Args('body')
    body: CreateFeedCommentInput,
  ) {
    return this.feedCommentsService.create(loginDetail.userId, feedId, body);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {string} id
   * @param {UpdateFeedCommentInput} body
   * @returns {Promise<FeedCommentResponse>}
   */
  @Mutation(() => FeedCommentResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async updateFeedComment(
    @LoginDetail() loginDetail,
    @Args('id', new ParseObjectIdPipe()) id: string,
    @Args('body')
    body: UpdateFeedCommentInput,
  ) {
    return this.feedCommentsService.update(loginDetail.userId, id, body);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} feedId
   * @param {ListCommentsInFeedInput} input
   * @returns {Promise<FeedCommentResponse>}
   */
  @Query(() => FeedCommentResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async listFeedComments(
    @Args('feedId', new ParseObjectIdPipe()) feedId: string,
    @Args('input')
    input: ListCommentsInFeedInput,
  ) {
    return this.feedCommentsService.findAllByFeedId(feedId, input);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {FeedCommentEntity} feed
   * @param {{ userId: any; }} param0
   * @param {*} param0.userId
   * @returns {Promise<boolean>\}
   */
  @ResolveField(() => Boolean)
  async isLiked(
    @Parent() feed: FeedCommentEntity,
    @LoginDetail() { userId },
    @Context() ctx: GqlContext,
  ) {
    const { _id: commentId } = feed;
    return ctx.commentLikeStatusLoader.load({ userId, commentId: String(commentId) });
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {FeedCommentEntity} feedComment
   * @returns {Promise<any>}
   */
  @ResolveField(() => UserProfileResponse)
  async userDetail(@Parent() feedComment: FeedCommentEntity, @Context() ctx: GqlContext) {
    const { postedBy } = feedComment;
    return ctx.userLoader.load(String(postedBy));
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {string} id
   * @returns {Promise<FeedCommentResponse>}
   */
  @Mutation(() => FeedCommentResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async deleteFeedComment(
    @LoginDetail() loginDetail,
    @Args('id', new ParseObjectIdPipe()) id: string,
  ) {
    return this.feedCommentsService.deleteFeedComment(loginDetail.userId, id);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {string} id
   * @returns {Promise<FeedCommentResponse>}
   */
  @Mutation(() => FeedCommentResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async likeComment(
    @LoginDetail() loginDetail,
    @Args('commentId', new ParseObjectIdPipe()) id: string,
  ) {
    return this.feedCommentsService.addLike(loginDetail.userId, id);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {string} id
   * @returns {Promise<FeedCommentResponse>}
   */
  @Mutation(() => FeedCommentResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async unlikeComment(
    @LoginDetail() loginDetail,
    @Args('commentId', new ParseObjectIdPipe()) id: string,
  ) {
    return this.feedCommentsService.removeLike(loginDetail.userId, id);
  }
}
