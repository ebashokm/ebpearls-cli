import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema, NotificationRepository } from '@app/data-access';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class NotificationsModule
 * @typedef {NotificationsModule}
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
  ],
  providers: [NotificationsResolver, NotificationsService, NotificationRepository],
  exports: [NotificationsService],
})
export class NotificationsModule {}
