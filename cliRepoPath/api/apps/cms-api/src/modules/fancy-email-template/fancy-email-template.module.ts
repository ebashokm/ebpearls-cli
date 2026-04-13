import { Module } from '@nestjs/common';

import {
  CommunicationEmail,
  CommunicationEmailRepository,
  CommunicationEmailSchema,
  EmailBuilder,
  EmailBuilderSchema,
  EmailTemplate,
  EmailTemplateRepository,
  EmailTemplateSchema,
  FancyEmailTemplateRepository,
} from '@app/data-access';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailBuilderService } from './fancy-email-template.service';
import { EmailBuilderResolver } from './fancy-email-template.resolver';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FancyEmailTemplateModule
 * @typedef {FancyEmailTemplateModule}
 */
@Module({
  imports: [
    // Register EmailTemplate model for EmailTemplateRepository
    MongooseModule.forFeature([{ name: EmailTemplate.name, schema: EmailTemplateSchema }]),

    // Register EmailBuilder model for FancyEmailTemplateRepository
    MongooseModule.forFeature([{ name: EmailBuilder.name, schema: EmailBuilderSchema }]),

    // If CommunicationEmailRepository uses a model, register it as well
    MongooseModule.forFeature([
      { name: CommunicationEmail.name, schema: CommunicationEmailSchema },
    ]),
  ],
  providers: [
    EmailBuilderResolver,
    EmailBuilderService,
    FancyEmailTemplateRepository,
    EmailTemplateRepository,
    CommunicationEmailRepository,
  ],
})
export class FancyEmailTemplateModule {}
