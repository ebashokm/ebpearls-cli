import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EmailTemplateService } from './email-template.service';
import { CreateEmailTemplateDTO } from './dto/input/create-email-template.dto';
import { UpdateEmailTemplateDTO } from './dto/input/update-email-template.dto';
import { EmailTemplate, EmailTemplateResponse } from './dto/response/email-template.response';
import { GetEmailTemplateDTO } from './dto/input/get-email-tempate.dto';
import { TemplateResponse } from './dto/response/template.response';
import { generateEmailTemplate, replacePlaceholders } from '@app/common/helpers/template-helper';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Permissions } from '../auth/decorator/permissions.decorator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class EmailTemplateResolver
 * @typedef {EmailTemplateResolver}
 */
@Resolver(() => EmailTemplate)
export class EmailTemplateResolver {
  /**
   * Creates an instance of EmailTemplateResolver.
   *
   * @constructor
   * @param {EmailTemplateService} emailTemplateService
   */
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateEmailTemplateDTO} input
   * @returns {Promise<{ message: any; emailTemplate: any; }>\}
   */
  @Mutation(() => EmailTemplateResponse)
  @Permissions('create-email-template')
  async createEmailTemplate(
    @Args('input')
    input: CreateEmailTemplateDTO,
    @I18n() i18n: I18nContext,
  ) {
    const emailTemplate = await this.emailTemplateService.create(input);
    return {
      message: i18n.t('common.create_success', { args: { entity: 'Email template' } }),
      emailTemplate,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {UpdateEmailTemplateDTO} input
   * @returns {Promise<{ message: any; emailTemplate: any; }>\}
   */
  @Mutation(() => EmailTemplateResponse)
  @Permissions('update-email-template')
  async updateEmailTemplate(
    @Args('id') id: string,
    @Args('input')
    input: UpdateEmailTemplateDTO,
    @I18n() i18n: I18nContext,
  ) {
    const templateUpdate = await this.emailTemplateService.updateById(id, input);
    return {
      message: i18n.t('common.update_success', { args: { entity: 'Email template' } }),
      emailTemplate: templateUpdate,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<{ message: any; }>\}
   */
  @Mutation(() => EmailTemplateResponse)
  @Permissions('delete-email-template')
  async removeEmailTemplate(@Args('id') id: string, @I18n() i18n: I18nContext) {
    await this.emailTemplateService.deleteById(id);
    return { message: i18n.t('common.delete_success', { args: { entity: 'Email template' } }) };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<{ message: any; }>\}
   */
  @Mutation(() => EmailTemplateResponse)
  @Permissions('delete-email-template')
  async removeAllEmailTemplates(@I18n() i18n: I18nContext) {
    await this.emailTemplateService.deleteMany();
    return { message: i18n.t('common.delete_all_success', { args: { entity: 'email template' } }) };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetEmailTemplateDTO} input
   * @returns {Promise<{ message: any; emailTemplates: any; pagination: any; }>\}
   */
  @Query(() => EmailTemplateResponse, { name: 'getAllEmailTemplates' })
  @Permissions('list-email-template')
  async findAll(@Args('input') input: GetEmailTemplateDTO, @I18n() i18n: I18nContext) {
    const { data, pagination } = await this.emailTemplateService.findAll(input);
    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'Email template' } }),
      emailTemplates: data,
      pagination,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<{ message: any; emailTemplate: any; }>\}
   */
  @Query(() => EmailTemplateResponse, { name: 'getEmailTemplate' })
  @Permissions('get-email-template')
  async findById(@Args('id') id: string, @I18n() i18n: I18nContext) {
    const emailTemplate = await this.emailTemplateService.findById(id);
    return {
      message: i18n.t('common.fetch_detail_success', { args: { entity: 'Email template' } }),
      emailTemplate,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} input
   * @returns {Promise<{ template: any; }>\}
   */
  @Query(() => TemplateResponse, { name: 'readEmailTemplate' })
  async readEmailTemplate(@Args('input') input: string) {
    const content = replacePlaceholders(input);
    const htmlContent = generateEmailTemplate(content);
    return { template: htmlContent };
  }
}
