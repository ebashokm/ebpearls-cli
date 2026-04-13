import { Module } from '@nestjs/common';
import { providers } from './providers';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseModels } from './mongooseModels';

@Module({
  imports: [MongooseModule.forFeature(mongooseModels), UsersModule],
  providers: providers,
  exports: [RapidIdModule, ...providers],
})
export class RapidIdModule {}
