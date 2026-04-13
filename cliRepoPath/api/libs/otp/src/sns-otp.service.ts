import { Inject, Injectable } from '@nestjs/common';
import AWS = require('aws-sdk');
import { ConfigOptions } from './config/config.options';
import { MODULE_OPTIONS_TOKEN } from './otp.definition';

@Injectable()
export class AwsSNSService {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly configOptions: ConfigOptions,
  ) {
    AWS.config.update({
      credentials: {
        accessKeyId: this.configOptions.accessKeyId,
        secretAccessKey: this.configOptions.secretAccessKey,
      },
      region: this.configOptions.region,
    });
  }

  /**
   * Use aws sdk to send sms
   * @param message : Message to send
   * @param phoneNumber : Number in which to send sms
   */
  async publishMessage(message: string, phoneNumber: string) {
    // Create publish parameters
    const params = {
      Message: message /* required */,
      PhoneNumber: phoneNumber,
    };
    // Create promise and SNS service object
    const publishTextPromise = new AWS.SNS({
      apiVersion: this.configOptions.apiVersion,
    })
      .publish(params)
      .promise();

    // Handle promise's fulfilled/rejected states
    publishTextPromise
      .then(function (data) {
        console.log('MessageID is ' + data.MessageId);
      })
      .catch(function (err) {
        console.error(err, err.stack);
      });
  }
}
