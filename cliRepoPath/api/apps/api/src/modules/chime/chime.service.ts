import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  ChimeSDKMeetingsClient,
  CreateAttendeeCommand,
  CreateAttendeeCommandInput,
  CreateMeetingCommand,
  DeleteMeetingCommand,
  GetMeetingCommand,
} from '@aws-sdk/client-chime-sdk-meetings';
import {
  PushNotificationTokenRepository,
  UsersRepository,
  ChimeRepository,
} from '@app/data-access';
import { v4 as uuidv4 } from 'uuid';
import { VoipHelperService } from '@app/common/services/voip/chime/chime';

@Injectable()
export class ChimeService {
  private readonly client: ChimeSDKMeetingsClient;
  constructor(
    private readonly voipHelperService: VoipHelperService,
    private readonly usersRepository: UsersRepository,
    private readonly pushNotificationTokenRepo: PushNotificationTokenRepository,
    private readonly chimeRepository: ChimeRepository,
  ) {
    this.client = new ChimeSDKMeetingsClient({
      region: process.env.AWS_CHIME_REGION,
      credentials: {
        accessKeyId: process.env.AWS_CHIME_ACCESS_KEY,
        secretAccessKey: process.env.AWS_CHIME_SECRET_KEY,
      },
    });
  }

  async createMeeting(userId: string) {
    const input = {
      ClientRequestToken: uuidv4(), // 'clientRequestToken'
      MediaRegion: process.env.AWS_CHIME_MEDIA_REGION || 'ap-southeast-2',
      MeetingHostId: process.env.MEETING_HOST_ID || 'meetingHostId',
      ExternalMeetingId: process.env.AWS_CHIME_EXTERNAL_MEETING_ID || 'testChimeMeeting',
    };

    const command = new CreateMeetingCommand(input);

    try {
      const response = await this.client.send(command);
      const meetingId = response?.Meeting?.MeetingId;
      await this.chimeRepository.create({ meetingId, userId });

      return { ...response };
    } catch (exception) {
      console.error('Error creating meeting:', exception);
    }
  }

  async getMeeting(meetingId: string) {
    const input = {
      MeetingId: meetingId,
    };
    try {
      const command = new GetMeetingCommand(input);
      const response = await this.client.send(command);
      return { ...response };
    } catch (e) {
      throw new BadRequestException('Meeting not found');
    }
  }

  async endChimeMeeting(meetingId: string) {
    const input = {
      MeetingId: meetingId,
    };

    try {
      await this.getMeeting(meetingId);

      const command = new DeleteMeetingCommand(input);
      await this.client.send(command);
      await this.chimeRepository.deleteOne({ meetingId });
      return { message: 'Meeting ended successfully' };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  async createMeetingAttendee(meetingId, userId) {
    try {
      const meetingInfo = await this.chimeRepository.findOne({ meetingId });

      if (!meetingInfo) {
        throw new NotFoundException('Meeting not found');
      }

      const input: CreateAttendeeCommandInput = {
        MeetingId: meetingId,
        ExternalUserId: userId,
        Capabilities: {
          Audio: 'SendReceive',
          Video: 'SendReceive',
          Content: 'SendReceive',
        },
      };
      const command = new CreateAttendeeCommand(input);
      const response = await this.client.send(command);

      return { ...response };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  async sendVOIPNotification(
    calleeId: string,
    meetingId: string,
    callerId: string,
    callType: string,
  ) {
    try {
      const { firstName, lastName } = await this.usersRepository.findById(callerId, {
        firstName: 1,
        lastName: 1,
      });
      const pushTokens = await this.pushNotificationTokenRepo.find({
        userId: calleeId,
      });

      let response;

      //for ios
      const voipTokens = pushTokens
        .filter((d) => d.voipToken && d.deviceType === 'ios')
        .map((d) => d.voipToken);

      if (voipTokens.length) {
        response = await this.voipHelperService.sendVoipIos(
          voipTokens,
          {
            meetingId,
            callType,
            callerId,
            calleeId,
            callerName: [firstName, lastName].join(' '),
          },
          'chime',
        );
      }
      // for android
      const FCMTokens = pushTokens
        .filter((d) => d.pushToken && d.deviceType === 'android')
        .map((d) => d.pushToken);
      response = await this.voipHelperService.sendVoipAndroid(
        FCMTokens,
        {
          meetingId,
          callType,
          callerId,
          calleeId,
          callerName: [firstName, lastName].join(' '),
        },
        'chime',
      );
      return response;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
