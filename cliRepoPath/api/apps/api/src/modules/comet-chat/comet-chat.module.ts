import { Module } from '@nestjs/common';
import { CometChatResolver } from './comet-chat.resolver';
import { CometChatHelperService } from '@app/common/helpers/comet-chat.helper';
import {
  CometUserGroup,
  CometUserGroupRepository,
  PushNotificationToken,
  PushNotificationTokenRepository,
  PushNotificationTokenSchema,
  CometUserGroupSchema,
} from '@app/data-access';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { CometChatController } from './controllers/comet-chat.controller';
import { CometChatService } from './comet-chat.service';
import { ConfigService } from '@nestjs/config';
import { FcmService } from '@app/fcm';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CometChatModule
 * @typedef {CometChatModule}
 */
@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: CometUserGroup.name,
        schema: CometUserGroupSchema,
      },
      {
        name: PushNotificationToken.name,
        schema: PushNotificationTokenSchema,
      },
    ]),
  ],
  providers: [
    CometChatResolver,
    CometChatService,
    CometChatHelperService,
    FcmService,

    ConfigService,
    CometUserGroupRepository,
    PushNotificationTokenRepository,
  ],
  controllers: [CometChatController],
})
export class CometChatModule {}
