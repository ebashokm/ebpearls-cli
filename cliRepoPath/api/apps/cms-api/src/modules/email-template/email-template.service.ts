import { EmailTemplateRepository } from '@app/data-access';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { CreateEmailTemplateDTO } from './dto/input/create-email-template.dto';
import { UpdateEmailTemplateDTO } from './dto/input/update-email-template.dto';
import { GetEmailTemplateDTO } from './dto/input/get-email-tempate.dto';
import { I18nService } from 'nestjs-i18n';
import { StorageService } from '@app/common/services/storage/storage.service';
import { Transactional } from '@nestjs-cls/transactional';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class EmailTemplateService
 * @typedef {EmailTemplateService}
 */
@Injectable()
export class EmailTemplateService {
  /**
   * Creates an instance of EmailTemplateService.
   *
   * @constructor
   * @param {StorageService} storageService
   * @param {EmailTemplateRepository} emailTemplateRepository
   * @param {mongoose.Connection} connection
   */
  constructor(
    private readonly storageService: StorageService,
    private readonly emailTemplateRepository: EmailTemplateRepository,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateEmailTemplateDTO} param0
   * @param {CreateEmailTemplateDTO} param0.title
   * @param {CreateEmailTemplateDTO} param0.slug
   * @param {CreateEmailTemplateDTO} param0.subject
   * @param {CreateEmailTemplateDTO} param0.body
   * @returns {Promise<any>}
   */
  @Transactional()
  async create({ title, slug, subject, body }: CreateEmailTemplateDTO) {
    const existingTemplate = await this.emailTemplateRepository.findOne({ slug });

    if (existingTemplate) {
      throw new BadRequestException(
        this.i18nService.t('common.already_exists', { args: { entity: 'Slug' } }),
      );
    }
    const emailTemplate = await this.emailTemplateRepository.create({
      title,
      slug,
      subject,
      body,
    });

    return emailTemplate;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetEmailTemplateDTO} input
   * @returns {Promise<any>}
   */
  async findAll(input: GetEmailTemplateDTO) {
    try {
      const { searchText, orderBy, order, limit, skip } = input;

      const pageMeta = { limit, skip, orderBy, order };
      const filter = {
        $or: [
          { title: { $regex: searchText, $options: 'i' } },
          { slug: { $regex: searchText, $options: 'i' } },
        ],
      };

      return await this.emailTemplateRepository.getAllTemplates(filter, pageMeta);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<any>}
   */
  async findById(id: string) {
    const emailTemplate = await this.emailTemplateRepository.findById(id);
    if (!emailTemplate) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Email template' } }),
      );
    }
    return emailTemplate;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {UpdateEmailTemplateDTO} param0
   * @param {UpdateEmailTemplateDTO} param0.title
   * @param {UpdateEmailTemplateDTO} param0.subject
   * @param {UpdateEmailTemplateDTO} param0.body
   * @returns {Promise<any>}
   */
  @Transactional()
  async updateById(id: string, { title, subject, body }: UpdateEmailTemplateDTO) {
    const emailTemplateExists = await this.emailTemplateRepository.findById(id);
    if (!emailTemplateExists) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Email template' } }),
      );
    }

    try {
      const templateUpdate = await this.emailTemplateRepository.updateById(
        id,
        { title, subject, body },
        { new: true },
      );

      return templateUpdate;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  @Transactional()
  async deleteById(id: string) {
    const emailTemplateExists = await this.emailTemplateRepository.findById(id);
    if (!emailTemplateExists) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Email template' } }),
      );
    }

    try {
      const templateDel = await this.emailTemplateRepository.softDeleteById(id);
      await this.storageService.deleteFile(`/views/templates/${templateDel.slug}.hbs`);

      return true;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<any>}
   */
  async deleteMany() {
    return this.emailTemplateRepository.softDelete({});
  }
}
