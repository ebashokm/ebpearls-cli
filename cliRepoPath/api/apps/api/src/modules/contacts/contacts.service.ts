import { BadRequestException, Injectable } from '@nestjs/common';
import { ContactsRepository } from '@app/data-access';
import { ListContactsDTO } from './dto/list-contact.dto';
import { Order } from '@app/common/enum/pagination';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  PROCESS_CONTACT_SYNC_OPTIMIZED,
  PROCESS_UPDATE_REGISTER_FLAG,
  QUEUE_NAME,
} from './constants';
import { I18nService } from 'nestjs-i18n';
import { SyncContactData } from './interface/contact.interface';

/**
 * Description placeholder
 *
 * @export
 * @class ContactsService
 * @typedef {ContactsService}
 */
@Injectable()
export class ContactsService {
  /**
   * Creates an instance of ContactsService.
   *
   * @constructor
   * @param {ContactsRepository} contactsRepository
   * @param {Queue} contactSyncQueue
   * @param {I18nService} i18nService
   */
  constructor(
    private readonly contactsRepository: ContactsRepository,
    @InjectQueue(QUEUE_NAME) private readonly contactSyncQueue: Queue,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * Description placeholder
   *
   * @async
   * @param {*} data
   * @returns {*}
   */
  async syncContact(data: SyncContactData) {
    try {
      await this.contactSyncQueue.add(PROCESS_CONTACT_SYNC_OPTIMIZED, data);
      await this.contactSyncQueue.add(PROCESS_UPDATE_REGISTER_FLAG, data, {
        delay: 4000,
      });
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {ListContactsDTO} input
   * @param {string} userId
   * @returns {unknown}
   */
  async findAll(input: ListContactsDTO, userId: string) {
    try {
      const { deviceId, searchText, orderBy, order, limit, skip } = input;

      const pageMeta = {
        limit,
        skip,
      };

      const sortQuery = { [orderBy]: order === Order.ASC ? 1 : -1 };

      const { data, pagination } = await this.contactsRepository.getAllContacts(
        deviceId,
        userId,
        pageMeta,
        sortQuery,
        searchText,
      );

      return {
        message: this.i18nService.t('contacts.contact_list'),
        contacts: data,
        pagination,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @returns {unknown}
   */
  async findOne(id: string) {
    try {
      const contact = await this.contactsRepository.findOne({
        _id: id,
        deletedAt: null,
      });

      return contact;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} deviceId
   * @param {string} contactId
   * @param {string} phoneNumber
   * @returns {unknown}
   */
  async findOneFromContactIdAndPhoneNumberId(
    deviceId: string,
    contactId: string,
    phoneNumber: string,
  ) {
    try {
      return this.contactsRepository.findOneFromContactIdAndPhoneNumberId(
        deviceId,
        contactId,
        phoneNumber,
      );
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} deviceId
   * @param {string[]} contactIds
   * @returns {*}
   */
  async removeMany(deviceId: string, contactIds: string[]): Promise<void> {
    await this.contactsRepository.deleteMany({
      contactId: { $in: contactIds },
      deviceId: deviceId,
    });
  }
}
