import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { mongooseModels } from './mongooseModels';
import { providers } from './providers';
import { EventsController } from '@app/common/services/sse/events.controller';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AdminModule
 * @typedef {AdminModule}
 */
@Module({
  imports: [MongooseModule.forFeature(mongooseModels)],
  providers: providers,
  exports: [AdminModule],
  controllers: [EventsController],
})
export class AdminModule {}
