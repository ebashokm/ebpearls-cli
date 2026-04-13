import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { BullModule } from '@nestjs/bullmq';
import { ContactsController } from './contacts.controller';
import { ContactsQueueProcessor } from './processors/contacts-queue.processor';
import { ContactsDataModule, ContactsRepository, UsersRepository } from '@app/data-access';
import { ContactsResolver } from './contacts.resolver';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { QUEUE_NAME } from './constants';

/**
 * Description placeholder
 *
 * @export
 * @class ContactsModule
 * @typedef {ContactsModule}
 */
@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAME,
    }),
    //import to show queue on board ui
    BullBoardModule.forFeature({
      name: QUEUE_NAME,
      adapter: BullMQAdapter, //or use BullAdapter if you're using bull instead of bullMQ
    }),
    ContactsDataModule,
  ],
  controllers: [ContactsController],
  providers: [
    ContactsResolver,
    ContactsService,
    ContactsQueueProcessor,
    ContactsRepository,
    UsersRepository,
  ],
  exports: [BullModule], // Export for reuse in other modules
})
export class ContactsModule {}
