import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { providers } from './providers';
import { User, UserSchema } from '@app/data-access';
import { AgoraRecording, AgoraRecordingSchema } from '@app/data-access/agora/agora-recording.schema';
@Module({
 imports: [
     MongooseModule.forFeature([
       {
         name: User.name,
         schema: UserSchema,
       },
       {
         name: AgoraRecording.name,
         schema: AgoraRecordingSchema,
       },
     ]),
   ],
  providers: providers,
})
export class CloudRecordingModule {}
