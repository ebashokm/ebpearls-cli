import { Resolver, Query, Mutation, Args, ResolveField, Parent, Context } from '@nestjs/graphql';
import { FeedRepliesService } from './feed-replies.service';
import { UpdateFeedReplyInput } from './dto/input/update-feed-reply.input';
import { FeedReplyEntity, FeedReplyResponse } from './dto/response/feed-reply.response';
import { UsersService } from '../users/users.service';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { LoginDetail } from '../auth/decorator/login.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthUserGuard } from '../../guards/auth.user.guard';
import { ParseObjectIdPipe } from '@app/common/pipe/parse-mongoid.pipe';
import { CreateFeedReplyInput } from './dto/input/create-feed-reply.input';
import { UserProfileResponse } from '../../common/dto/user.response';
import { ListRepliesInFeedInput } from '../feeds/dto/input/list-feeds.input';
import { TermsGuard } from '@api/guards/terms.guard';
import { GqlContext } from '../../graphql/context.factory';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedRepliesResolver
 * @typedef {FeedRepliesResolver}
 */
@Resolver(() => FeedReplyEntity)
export class FeedRepliesResolver {
  /**
   * Creates an instance of FeedRepliesResolver.
   *
   * @constructor
   * @param {FeedRepliesService} feedRepliesService
   * @param {UsersService} usersService
   */
  constructor(
    private readonly feedRepliesService: FeedRepliesService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {string} commentId
   * @param {CreateFeedReplyInput} body
   * @returns {Promise<FeedReplyResponse>}
   */
  @Mutation(() => FeedReplyResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async createFeedReply(
    @LoginDetail() loginDetail,
    @Args('commentId', new ParseObjectIdPipe()) commentId: string,
    @Args('body') body: CreateFeedReplyInput,
  ) {
    return this.feedRepliesService.create(loginDetail.userId, commentId, body);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} commentId
   * @param {ListRepliesInFeedInput} input
   * @returns {Promise<FeedReplyResponse>}
   */
  @Query(() => FeedReplyResponse, { name: 'listFeedReplies' })
  @UseGuards(AuthUserGuard, TermsGuard)
  async listFeedReplies(
    @Args('commentId', new ParseObjectIdPipe()) commentId: string,
    @Args('input')
    input: ListRepliesInFeedInput,
  ) {
    return this.feedRepliesService.findAllByCommentId(commentId, input);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {FeedReplyEntity} feed
   * @param {{ userId: any; }} param0
   * @param {*} param0.userId
   * @returns {Promise<boolean>\}
   */
  @ResolveField(() => Boolean)
  async isLiked(
    @Parent() feed: FeedReplyEntity,
    @LoginDetail() { userId },
    @Context() ctx: GqlContext,
  ) {
    const { _id: replyId } = feed;
    return ctx.replyLikeStatusLoader.load({ userId, replyId: String(replyId) });
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {FeedReplyEntity} feedComment
   * @returns {Promise<any>}
   */
  @ResolveField(() => UserProfileResponse)
  async userDetail(@Parent() feedComment: FeedReplyEntity, @Context() ctx: GqlContext) {
    const { postedBy } = feedComment;
    return ctx.userLoader.load(String(postedBy));
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {string} id
   * @param {UpdateFeedReplyInput} body
   * @returns {Promise<MessageResponse>}
   */
  @Mutation(() => MessageResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async updateFeedReply(
    @LoginDetail() loginDetail,
    @Args('id', new ParseObjectIdPipe()) id: string,
    @Args('body') body: UpdateFeedReplyInput,
  ) {
    return this.feedRepliesService.update(loginDetail.userId, id, body);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {string} id
   * @returns {Promise<MessageResponse>}
   */
  @Mutation(() => MessageResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async deleteFeedReply(
    @LoginDetail() loginDetail,
    @Args('id', new ParseObjectIdPipe()) id: string,
  ) {
    return this.feedRepliesService.deleteFeedReply(loginDetail.userId, id);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {string} id
   * @returns {Promise<MessageResponse>}
   */
  @Mutation(() => MessageResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async likeReply(
    @LoginDetail() loginDetail,
    @Args('replyId', new ParseObjectIdPipe()) id: string,
  ) {
    return this.feedRepliesService.addLike(loginDetail.userId, id);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {string} id
   * @returns {Promise<MessageResponse>}
   */
  @Mutation(() => MessageResponse)
  @UseGuards(AuthUserGuard, TermsGuard)
  async unlikeReply(
    @LoginDetail() loginDetail,
    @Args('replyId', new ParseObjectIdPipe()) id: string,
  ) {
    return this.feedRepliesService.removeLike(loginDetail.userId, id);
  }
}
