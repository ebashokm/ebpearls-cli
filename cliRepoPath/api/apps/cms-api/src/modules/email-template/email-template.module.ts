import { Module } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { EmailTemplateResolver } from './email-template.resolver';
import { EmailTemplate, EmailTemplateRepository, EmailTemplateSchema } from '@app/data-access';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageService } from '@app/common/services/storage/storage.service';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class EmailTemplateModule
 * @typedef {EmailTemplateModule}
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: EmailTemplate.name, schema: EmailTemplateSchema }])],
  providers: [EmailTemplateResolver, EmailTemplateService, StorageService, EmailTemplateRepository],
})
export class EmailTemplateModule {}
