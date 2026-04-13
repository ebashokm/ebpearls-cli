import { Inject, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ConfigOptions } from './config/config.options';
import { TWILIO_BODY_MESSAGE } from './config/config.constants';
import { MODULE_OPTIONS_TOKEN } from './otp.definition';

@Injectable()
export class TwilioSendSmsService {
  client: any = null;
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly configOptions: ConfigOptions,
  ) {}

  async sendSms(contactNumber: string, code: any) {
    this.client = new Twilio(
      this.configOptions.accountSid,
      this.configOptions.authToken,
    );

    const body = `${TWILIO_BODY_MESSAGE} ${code}`;
    const response = await this.client.messages
      .create({
        to: contactNumber,
        from: this.configOptions.twilioNumber,
        body,
      })
      .then((message) => {
        console.log('message is', message);
        return message;
      });
    console.log('\n twilio send sms code response \n', response);
  }
}
