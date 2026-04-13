import {
  CommunicationEmailRepository,
  EmailTemplateRepository,
  FancyEmailTemplateRepository,
} from '@app/data-access';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { convertStringIdToObjectId } from '@app/common/helpers/genericFunction';
import { toMongoId } from '@app/common/helpers/mongo-helper';

import {
  CreateEmailBuilderInput,
  UpdateActiveStatusOfEmailTemplateDTO,
} from './dto/input/create-email-builder.input.dto';
import { ListEmailTemplatesDTO } from './dto/input/list-email.builder.dto';
import { EmailType } from '@app/common/enum/user-status.enum';
import {
  DEFAULT_EMAIL_BUILDER_SLUG,
  DEFAULT_EMAIL_BUILDER_TEMPLATE_NAME,
} from '@api/constants/datapoint';
import { FancyEmailResult } from './types/fancy-email.types';
import { I18nService } from 'nestjs-i18n';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class EmailBuilderService {
  constructor(
    private readonly emailBuilderRepository: FancyEmailTemplateRepository,
    private readonly emailTemplateRepository: EmailTemplateRepository,
    private readonly communicationEmailRepository: CommunicationEmailRepository,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * @description Save and update an email builder templates.
   * @param data - The email builder data based on CreateEmailBuilderInput.
   * @param business - The business object or user object.
   * @returns An object containing a success field indicating whether the operation was successful, a message field containing an error message if the operation failed, and a data field containing the saved email builder data.
   */
  @Transactional()
  async save(data: CreateEmailBuilderInput) {
    const result: FancyEmailResult = { success: true, message: null, data: null };

    try {
      if (data.action == 'update') {
        result.data = await this.emailBuilderRepository.updateOne(
          {
            _id: convertStringIdToObjectId(data._id),
          },
          { ...data, isDraft: false },
        );
        await this.communicationEmailRepository.updateOne(
          {
            _id: data.communicationId,
          },
          {
            isDraft: false,
          },
        );

        const communication = await this.communicationEmailRepository.findOne({
          _id: convertStringIdToObjectId(data.communicationId),
        });

        if (communication && communication.audienceId === 'none') {
          communication.isCompletedFullProcess = true;
          communication.save();
        }
      } else {
        delete data._id;
        result.data = await this.emailBuilderRepository.create({
          ...data,
          isDraft: false,
        });
        await this.communicationEmailRepository.updateOne(
          {
            _id: data.communicationId,
          },
          {
            isDraft: false,
          },
        );
      }
    } catch (error) {
      result.success = false;
      result.message = error.message;
    }

    return result;
  }

  async list() {
    const result: FancyEmailResult = { success: true, message: null, data: null };

    try {
      const templates = await this.emailBuilderRepository.find({ status: 'active' });

      // Convert each Mongoose Document to a plain JS object
      result.data = templates.map((template) => {
        const obj = template.toObject(); // <-- converts document to plain object

        // Serialize ObjectIds to strings
        obj._id = obj._id.toString();
        obj.communicationId = obj.communicationId?.toString() || null;

        return obj;
      });
    } catch (error) {
      result.success = false;
      result.message = error.message;
    }

    return result;
  }

  async templateListWithPagination(input: ListEmailTemplatesDTO) {
    return await this.emailBuilderRepository.listEmailBuilderTemplates(input);
  }
  async get(communicationId: string) {
    const result: FancyEmailResult = { success: true, message: null, data: null };

    try {
      const emailDetails = await this.communicationEmailRepository.findOne({
        _id: toMongoId(communicationId),
      });

      if (!emailDetails) {
        throw new NotFoundException(I18nService);
      }

      if (emailDetails.emailType === EmailType.SIMPLEEMAIL) {
        result.data = emailDetails;
        result.data.name = emailDetails.emailName;
      }

      if (emailDetails.emailType === EmailType.FANCYEMAIL) {
        result.data = await this.emailBuilderRepository.findOne({
          communicationId: toMongoId(communicationId),
        });
        result.data.name = emailDetails.emailName;
      }
    } catch (error) {
      result.success = false;
      result.message = error.message;
    }

    return result;
  }

  async getTemplate(id: string) {
    const result: FancyEmailResult = { success: true, message: null, data: null };

    try {
      result.data = (await this.emailBuilderRepository.findOne({ _id: toMongoId(id) }))?.toObject();
    } catch (error) {
      result.success = false;
      result.message = error.message;
    }

    return result;
  }

  async getDefaultTemplate() {
    const result: FancyEmailResult = { success: true, message: null, data: null };

    try {
      result.data = await this.emailBuilderRepository.findOne({
        name: DEFAULT_EMAIL_BUILDER_TEMPLATE_NAME,
        default: true,
      });

      //   If no default template is found, try to create one
      if (!result.data) {
        const checkResult = await this.checkAndSetDefault();

        if (checkResult.success) {
          // Try to get the newly created default template
          result.data = await this.emailBuilderRepository.findOne({
            name: DEFAULT_EMAIL_BUILDER_TEMPLATE_NAME,
            default: true,
          });
        } else {
          result.success = false;
          result.message = checkResult.message;
        }
      }
    } catch (error) {
      result.success = false;
      result.message = error.message;
    }

    return result;
  }

  /**
   * @description Checks if the default email template exists for the given business, and if not, creates it.
   * @param businessId - The id of the business for which to check and set the default email template.
   * @returns An object containing a success field indicating whether the operation was successful, and a message field containing an error message if the operation failed.
   */
  async checkAndSetDefault() {
    const result: FancyEmailResult = { success: true, message: null, data: {} };
    let emailTempalte = null;

    try {
      // Check if default template exists
      const defaultTemplate = await this.emailBuilderRepository.findOne({
        name: DEFAULT_EMAIL_BUILDER_TEMPLATE_NAME,
        default: true,
      });

      // If no default template exists, create one
      if (!defaultTemplate) {
        emailTempalte = await this.emailTemplateRepository.findOne({
          slug: DEFAULT_EMAIL_BUILDER_SLUG,
        });

        if (Object.keys(emailTempalte).length) {
          await this.emailBuilderRepository.create({
            name: DEFAULT_EMAIL_BUILDER_TEMPLATE_NAME,
            jsonContent: emailTempalte.body,
            htmlContent: '',

            communicationId: emailTempalte._id,
            default: true,
          });
        } else {
          result.success = false;
          result.message = 'Default email template not found in emailTemplateRepository';
        }
      }
    } catch (error) {
      result.success = false;
      result.message = error.message;
    }

    return result;
  }

  @Transactional()
  async updateActiveStatusOfEmailTemplate(input: UpdateActiveStatusOfEmailTemplateDTO) {
    const recallTask = await this.emailBuilderRepository.updateOne(
      {
        _id: input.templateId,
      },
      {
        status: input.status,
      },
    );

    if (!recallTask) {
      throw new BadRequestException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Email template' } }),
      );
    }

    return {
      message: this.i18nService.t('common.status_updated', { args: { entity: 'Email template' } }),
    };
  }
}
