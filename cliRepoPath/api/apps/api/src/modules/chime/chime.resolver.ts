import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ChimeService } from './chime.service';
import { UseGuards } from '@nestjs/common';
import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { LoginDetail } from '../auth/decorator/login.decorator';
import { LoginDetailType } from '../auth/types/login-detail.type';
import {
  InitiateMeetingResponse,
  MeetingResponse,
} from './dto/response/chime-response';
import {
  InitiateMeetingInput,
  MeetingInput,
} from './dto/input/create-chime.input';
import { MessageResponse } from '@app/common/dto/response/message.response';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ChimeResolver
 * @typedef {ChimeResolver}
 */
@Resolver(() => MeetingResponse)
export class ChimeResolver {
  /**
   * Creates an instance of ChimeResolver.
   *
   * @constructor
   * @param {ChimeService} chimeService
   */
  constructor(private readonly chimeService: ChimeService) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {InitiateMeetingInput} param0
   * @param {string} param0.calleeId
   * @param {string} param0.callType
   * @param {string} param0.deviceType
   * @param {LoginDetailType} param1
   * @param {string} param1.userId
   * @returns {Promise<{ meetingResponse: any; attendeeResponse: any; }>\}
   */
  @Mutation(() => InitiateMeetingResponse)
  @UseGuards(AuthUserGuard)
  async initiateChimeMeeting(
    @Args('body') { calleeId, callType, deviceType }: InitiateMeetingInput,
    @LoginDetail() { userId }: LoginDetailType,
  ) {
    const meetingResponse = await this.chimeService.createMeeting(userId);
    const meetingId = meetingResponse?.Meeting?.MeetingId;

    const attendeeResponse = await this.chimeService.createMeetingAttendee(
      meetingId,
      userId,
    );

    await this.chimeService.sendVOIPNotification(
      calleeId,
      meetingId,
      userId,
      callType,
    );

    return {
      meetingResponse: meetingResponse.Meeting,
      attendeeResponse: attendeeResponse.Attendee,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {LoginDetailType} param0
   * @param {string} param0.userId
   * @param {MeetingInput} param1
   * @param {string} param1.meetingId
   * @returns {Promise<{ message: string; }>\}
   */
  @Mutation(() => MessageResponse)
  @UseGuards(AuthUserGuard)
  async endChimeMeeting(
    @LoginDetail() { userId }: LoginDetailType,
    @Args('body') { meetingId }: MeetingInput,
  ) {
    return await this.chimeService.endChimeMeeting(meetingId);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {MeetingInput} param0
   * @param {string} param0.meetingId
   * @returns {Promise<any>}
   */
  @Query(() => MeetingResponse)
  @UseGuards(AuthUserGuard)
  async getMeetingInfo(@Args('body') { meetingId }: MeetingInput) {
    const meetingInfo = await this.chimeService.getMeeting(meetingId);
    const MeetingResponse = meetingInfo.Meeting;
    return MeetingResponse;
  }
}
