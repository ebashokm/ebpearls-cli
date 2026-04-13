import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ContactsService } from './contacts.service';
import { Contacts } from '@app/data-access';
import { ListContactsDTO } from './dto/list-contact.dto';
import { LoginDetailType } from '../auth/types/login-detail.type';
import { LoginDetail } from '../auth/decorator/login.decorator';
import {
  ContactDetailResponse,
  ContactDetailsResponse,
  ContactsListResponse,
} from './response/contact-list.response';
import { Inject, LoggerService, UseGuards } from '@nestjs/common';
import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { I18n, I18nContext } from 'nestjs-i18n';
import { SkipThrottle } from '@nestjs/throttler';

// Note: uncomment this if want to use permissions
// import { Permissions } from '../auth/decorator/permissions.decorator';

/**
 * Description placeholder
 *
 * @export
 * @class ContactsResolver
 * @typedef {ContactsResolver}
 */
@Resolver(() => Contacts)
export class ContactsResolver {
  /**
   * Creates an instance of ContactsResolver.
   *
   * @constructor
   * @param {ContactsService} contactsService
   */
  constructor(private readonly contactsService: ContactsService) {}

  /**
   * Description placeholder
   *
   * @async
   * @param {LoginDetailType} loginDetail
   * @param {ListContactsDTO} input
   * @returns {unknown}
   */
  @SkipThrottle()
  @UseGuards(AuthUserGuard)
  @Query(() => ContactsListResponse, { name: 'contacts', nullable: true })
  async findAll(
    @LoginDetail() loginDetail: LoginDetailType,
    @Args('input') input: ListContactsDTO,
  ) {
    return await this.contactsService.findAll(input, loginDetail.userId);
  }

  /**
   * Description placeholder
   *
   * @param {string} id
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Query(() => ContactDetailResponse, { name: 'contact', nullable: true })
  findOne(@Args('id') id: string) {
    return this.contactsService.findOne(id);
  }

  /**
   * Description placeholder
   *
   * @param {string} deviceId
   * @param {string} contactId
   * @param {string} phoneNumber
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Query(() => ContactDetailsResponse, {
    name: 'contactFromContactIdAndPhoneNumberId',
    nullable: true,
  })
  getFromContactIdAndPhoneNumberId(
    @Args('deviceId') deviceId: string,
    @Args('contactId') contactId: string,
    @Args('phoneNumber') phoneNumber: string,
  ) {
    return this.contactsService.findOneFromContactIdAndPhoneNumberId(
      deviceId,
      contactId,
      phoneNumber,
    );
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string[]} contactIds
   * @param {string} deviceId
   * @param {I18nContext} i18n
   * @returns {unknown}
   */
  @Mutation(() => MessageResponse)
  async removeContacts(
    @Args('contactIds', { type: () => [String] }) contactIds: string[],
    @Args('deviceId') deviceId: string,
    @I18n() i18n: I18nContext,
  ) {
    await this.contactsService.removeMany(deviceId, contactIds);
    return { message: i18n.t('contacts.contact_removed') };
  }
}
