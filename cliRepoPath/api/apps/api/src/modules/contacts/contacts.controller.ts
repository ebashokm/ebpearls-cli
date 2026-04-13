import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Sse,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { LoginDetail } from '../auth/decorator/login.decorator';
import { LoginDetailType } from '../auth/types/login-detail.type';
import { ContactsService } from './contacts.service';
import { SyncContactData } from './interface/contact.interface';
import { interval, map, Observable } from 'rxjs';

export interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}

/**
 * Description placeholder
 *
 * @export
 * @class ContactsController
 * @typedef {ContactsController}
 */
@Controller('upload-contacts')
export class ContactsController {
  /**
   * Creates an instance of ContactsController.
   *
   * @constructor
   * @param {ContactsService} contactsService
   */
  constructor(private readonly contactsService: ContactsService) {}

  @Sse('sseTest')
  sseTest(): Observable<MessageEvent> {
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }

  /**
   * Upload contact file of MaxSize 12 MB, file type application/json
   *
   * @async
   * @param {LoginDetailType} loginDetail
   * @param {string} deviceId
   * @param {Express.Multer.File} file
   * @returns {unknown}
   */
  @Post('upload')
  @UseGuards(AuthUserGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadContacts(
    @LoginDetail() loginDetail: LoginDetailType,
    @Body('deviceId') deviceId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 12582912 }),
          new FileTypeValidator({ fileType: 'application/json', skipMagicNumbersValidation: true }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file?.buffer) {
      throw new Error('File not provided or empty');
    }
    const contactJsonData = JSON.parse(file.buffer.toString());
    const data: SyncContactData = {
      userId: loginDetail.userId,
      deviceId: deviceId,
      contacts: contactJsonData.contacts,
    };

    if (!deviceId) {
      throw new BadRequestException('DeviceId is required');
    }

    // Add data to Bull queue for processing
    try {
      if (contactJsonData.deletedContacts && contactJsonData.deletedContacts.length > 0) {
        const deletedContacts = contactJsonData.deletedContacts;
        await this.contactsService.removeMany(deviceId, deletedContacts);
      }

      if (contactJsonData.contacts && contactJsonData.contacts.length > 0) {
        await this.contactsService.syncContact(data);
      }

      return { message: 'Contact Sync Successfully' };
    } catch (error) {
      throw new Error(error);
    }
  }
}
