import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ChimeService } from './chime.service';
import { ChimeResolver } from './chime.resolver';
import {
  PushNotificationToken,
  PushNotificationTokenRepository,
  PushNotificationTokenSchema,
  User,
  UserSchema,
  UsersRepository,
  ChimeRepository,
  Chime,
  ChimeSchema,
} from '@app/data-access';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { FcmService } from '@app/fcm';
import { VoipHelperService } from '@app/common/services/voip/chime/chime';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    MongooseModule.forFeature([
      {
        name: PushNotificationToken.name,
        schema: PushNotificationTokenSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Chime.name,
        schema: ChimeSchema,
      },
    ]),
  ],

  providers: [
    ChimeResolver,
    ChimeService,
    FcmService,
    ConfigService,
    VoipHelperService,
    UsersRepository,
    PushNotificationTokenRepository,
    ChimeRepository,
  ],
})
export class ChimeModule {}
