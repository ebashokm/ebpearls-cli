import { Injectable, Inject } from '@nestjs/common';
import { EmailTemplateRepository } from '@app/data-access';
import { replacePlaceholders, generateEmailTemplate } from '@app/common/helpers/template-helper';
import { RequestedFor } from '@app/common/enum/otp-request.enum';
import { IEmailService } from './email.service.interface';

@Injectable()
export class EmailService {
  constructor(
    private readonly emailTemplateRepository: EmailTemplateRepository,
    @Inject('EmailService') private readonly emailService: IEmailService,
  ) {}

  async sendEmail({
    to,
    values,
    slug,
  }: {
    to: string;
    values: any;
    slug: RequestedFor;
  }): Promise<boolean> {
    const templateData = await this.emailTemplateRepository.findOne(
      { slug },
      {},
      { session: null },
    );

    if (!templateData) {
      return false;
    }

    const content = replacePlaceholders(templateData.body, values);
    const htmlContent = generateEmailTemplate(content);

    await this.emailService.sendEmail({
      email: to,
      subject: templateData.subject,
      template: htmlContent,
    });
    return true;
  }
}
