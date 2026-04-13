import { Injectable } from '@nestjs/common';
import AWS = require('aws-sdk');

@Injectable()
export class AwsSNSService {
  constructor() {
    AWS.config.update({
      credentials: {
        accessKeyId: process.env.AWS_SNS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SNS_SECRET_KEY,
      },
      region: 'ap-southeast-2',
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
    const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

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
