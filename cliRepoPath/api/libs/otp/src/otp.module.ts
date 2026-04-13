import { Module } from '@nestjs/common';
import { AwsSNSService } from './sns-otp.service';
import { ConfigurableModuleClass } from './otp.definition';
import { TwilioSendSmsService } from './twilio-otp.service';

@Module({
  providers: [AwsSNSService, TwilioSendSmsService],
  exports: [AwsSNSService, TwilioSendSmsService],
})
export class OtpModule extends ConfigurableModuleClass {}
