import { HttpException, HttpStatus } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorator/get-user.decorator';
import {
  CreateEmailBuilderInput,
  UpdateActiveStatusOfEmailTemplateDTO,
} from './dto/input/create-email-builder.input.dto';
import { CreateEmailBuilderResponse } from './dto/response/create-builder.response';
import { EmailBuilderService } from './fancy-email-template.service';
import { Permissions } from '../auth/decorator/permissions.decorator';
import {
  EmailBuilderResponse,
  EmailBuilderTemplateResponse,
  ListEmailBuilders,
} from './dto/response/list-email-builder.response';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { ListEmailTemplatesDTO } from './dto/input/list-email.builder.dto';
import { SetMetadata } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Resolver()
export class EmailBuilderResolver {
  constructor(
    private readonly emailBuilderService: EmailBuilderService,
    private readonly i18nService: I18nService,
  ) {}

  @Mutation(() => CreateEmailBuilderResponse)
  @Permissions('create-email-template')
  async createBuilderTemplate(@Args('input') input: CreateEmailBuilderInput) {
    const result = await this.emailBuilderService.save(input);

    if (result.success) {
      return {
        message: this.i18nService.t('email.email_template_created'),
      };
    } else {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Query(() => ListEmailBuilders)
  @Permissions('list-email-template')
  async getBuilderTemplates() {
    const result = await this.emailBuilderService.list();

    if (result.success) {
      return {
        templates: result.data,
        message: this.i18nService.t('common.fetch_list_success', {
          args: { entity: 'Email templates' },
        }),
      };
    } else {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Permissions('list-email-template')
  @Query(() => EmailBuilderTemplateResponse)
  async getBuilderTemplatesWithPagination(
    @Args('listAllEmailTemplates') input: ListEmailTemplatesDTO,
  ) {
    return await this.emailBuilderService.templateListWithPagination(input);
  }

  @Permissions('get-email-template')
  @Query(() => EmailBuilderResponse)
  async getEmailBuilderDetail(@Args('communicationId') communicationId: string) {
    const result = await this.emailBuilderService.get(communicationId);

    if (result.success) {
      return result.data;
    } else {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Permissions('get-email-template')
  @Query(() => EmailBuilderResponse)
  async getEmailBuilderTemplateDetail(@Args('id') id: string) {
    const result = await this.emailBuilderService.getTemplate(id);

    if (result.success) {
      return result.data;
    } else {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Permissions('get-email-template')
  @Query(() => EmailBuilderResponse)
  async getEmailBuilderDefaultTemplateDetail() {
    const result = await this.emailBuilderService.getDefaultTemplate();

    if (result.success) {
      return result.data;
    } else {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Mutation(() => MessageResponse)
  @Permissions('update-email-template')
  updateActiveStatusOfEmailTemplate(@Args('input') input: UpdateActiveStatusOfEmailTemplateDTO) {
    return this.emailBuilderService.updateActiveStatusOfEmailTemplate(input);
  }
}
