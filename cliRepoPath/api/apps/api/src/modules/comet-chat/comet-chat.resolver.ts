import { Resolver, Query, Args } from '@nestjs/graphql';
import { CometChatHelperService } from '@app/common/helpers/comet-chat.helper';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { LoginDetail } from '../auth/decorator/login.decorator';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { LoginDetailType } from '../auth/types/login-detail.type';
import { CometUserGroupRepository } from '@app/data-access';
import { CometChatGroupResponse } from './dto/response/comet-chat-group.response';
import { CreateCometChatGroupInput } from './dto/input/create-comet-chat.input';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CometChatResolver
 * @typedef {CometChatResolver}
 */
@Resolver(() => CometChatGroupResponse)
export class CometChatResolver {
  /**
   * Creates an instance of CometChatResolver.
   *
   * @constructor
   * @param {CometChatHelperService} cometChatHelperService
   * @param {CometUserGroupRepository} cometUserGroupRepo
   */
  constructor(
    private readonly cometChatHelperService: CometChatHelperService,
    private readonly cometUserGroupRepo: CometUserGroupRepository,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {LoginDetailType} loginDetail
   * @param {CreateCometChatGroupInput} body
   * @returns {Promise<CometChatGroupResponse>}
   */
  @Query(() => CometChatGroupResponse)
  @UseGuards(AuthUserGuard)
  async createCometChatGroup(
    @LoginDetail() loginDetail: LoginDetailType,
    @Args('body') body: CreateCometChatGroupInput,
  ): Promise<CometChatGroupResponse> {
    const { guid, propertyId, propertyOwnerId } = body;
    try {
      const group = await this.cometUserGroupRepo.findOne({
        guid,
      });

      if (group) {
        throw new BadRequestException('Group already exists');
      }

      const validGroup = await this.cometChatHelperService.getCometChatGroup(guid);
      if (!validGroup) {
        throw new BadRequestException('Group not found');
      }

      const newGroup = await this.cometUserGroupRepo.create({
        guid,
        propertyId,
        propertyOwnerId,
        requesterId: loginDetail.userId,
      });

      return newGroup;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {LoginDetailType} loginDetail
   * @param {string} guid
   * @returns {Promise<MessageResponse>}
   */
  @Query(() => MessageResponse)
  @UseGuards(AuthUserGuard)
  async deleteCometChatGroup(
    @LoginDetail() loginDetail: LoginDetailType,
    @Args('guid') guid: string,
  ): Promise<MessageResponse> {
    try {
      const group = await this.cometUserGroupRepo.findOne({
        guid,
        requesterId: loginDetail.userId,
      });

      if (!group) {
        throw new BadRequestException('Group not found');
      }

      await this.cometUserGroupRepo.deleteOne({
        guid,
      });

      await this.cometChatHelperService.deleteCometChatGroup(guid);

      return {
        message: 'CometChat Group deleted successfully',
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
