import { Processor, WorkerHost } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ContactsRepository, UsersRepository } from '@app/data-access';
import { InsertContactData } from '../interface/contact.interface';
import { Job } from 'bullmq';
import {
  PROCESS_CONTACT_SYNC,
  PROCESS_CONTACT_SYNC_OPTIMIZED,
  // PROCESS_ELASTIC_SEARCH_SYNC,
  PROCESS_UPDATE_REGISTER_FLAG,
  QUEUE_NAME,
} from '../constants';

@Injectable()
@Processor(QUEUE_NAME)
export class ContactsQueueProcessor extends WorkerHost {
  constructor(
    private readonly contactsRepository: ContactsRepository,
    private readonly usersRepository: UsersRepository,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case PROCESS_CONTACT_SYNC: {
        await this.handleAddContactSync(job.data);
        break;
      }
      case PROCESS_CONTACT_SYNC_OPTIMIZED: {
        await this.handleContactSyncOptimized(job.data);
        break;
      }
      case PROCESS_UPDATE_REGISTER_FLAG: {
        await this.handleUpdateConactRegisteredFlag(job.data);
        break;
      }
      // Note: uncomment this if want to use elastic
      // case PROCESS_ELASTIC_SEARCH_SYNC: {
      //   await this.handleContactSyncToElasticOptimized(job.data);
      //   break;
      // }
    }
  }

  async handleAddContactSync(data) {
    const contacts: any = data.contacts;

    const newContacts: any = contacts.map((c) => {
      return {
        ...c,
        deviceId: data.deviceId,
        contactId: c.contactId,
        userId: data.userId,
      };
    });

    await this.contactsRepository.createMany(newContacts);
  }

  async handleContactSyncOptimized(data) {
    const contacts: InsertContactData[] = data.contacts;

    const bulkOps = contacts.map((contact) => {
      return {
        updateOne: {
          filter: {
            contactId: contact.contactId,
            userId: data.userId,
            deviceId: data.deviceId,
          },
          update: {
            $set: {
              name: contact.name,
              phoneNumbers: contact.phoneNumbers,
              updatedAt: new Date(),
            },
          },
          upsert: true,
        },
      };
    });

    console.log('bulk write started.......');

    try {
      await this.contactsRepository.bulkWrite(bulkOps);
    } catch (e) {
      throw new BadRequestException(e?.message);
    }

    console.log('bulk write completed.....');
  }

  async handleUpdateConactRegisteredFlag(data) {
    const distinctPhoneNumbers = await this.usersRepository.getAllDistinctPhoneNumbers();
    const phoneNumbers = distinctPhoneNumbers.map((item) => item.phoneNumber);
    console.log('updateConactRegisteredFlag started.......');
    await this.contactsRepository.updateConactRegisteredFlag(data.userId, phoneNumbers);
    console.log('updateConactRegisteredFlag completed.......');
  }

  // Note: For syncing to elastic search
  // async handleContactSyncToElasticOptimized(data) {
  //   const contacts: InsertContactData[] = data.contacts;
  //   //await this.contactSearchService.syncContacts(contacts)
  //   console.log('completed.....');
  // }
  // @Process('contact-sync-process')
  // async handleContactSync(job: { data: any }) {
  //   const data = job.data;
  //   const contacts: InsertContactData[] = data.contacts;
  //   for (const contact of contacts) {
  //     const existingContact = await this.contactsRepository.findOne({
  //       userId: data.userId,
  //       'phoneNumbers.phoneNumber': contact.phoneNumbers.map(
  //         (p) => p.phoneNumber,
  //       ),
  //       deviceId: data.deviceId,
  //     });
  //     if (existingContact) {
  //       await this.contactsRepository.updateOne(
  //         { _id: existingContact._id }, // Filter criteria
  //         {
  //           $set: {
  //             name: contact.name,
  //             phoneNumbers: contact.phoneNumbers,
  //             updatedAt: new Date(),
  //           },
  //         },
  //       );
  //     } else {
  //       const newContact = {
  //         ...contact,
  //         deviceId: data.deviceId,
  //         userId: data.userId,
  //         isUserRegistered: false,
  //       };
  //       await this.contactsRepository.create(newContact);
  //     }
  //   }
  // }
}
