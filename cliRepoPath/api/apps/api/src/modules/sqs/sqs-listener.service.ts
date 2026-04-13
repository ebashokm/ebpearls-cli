import { SqsBaseService } from '@app/common/services/sqs';
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer } from 'sqs-consumer';
import { SQSHandlerService } from './sqs-handler.service';
import { Message } from '@aws-sdk/client-sqs';

@Injectable()
export class SqsListenerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SqsListenerService.name);
  private readonly sqsQueueUrl: string;
  private consumer: Consumer;

  constructor(
    private readonly configService: ConfigService,
    private readonly sqsBaseService: SqsBaseService,
    private readonly sqsHandlerService: SQSHandlerService,
  ) {
    this.sqsQueueUrl = this.configService.get<string>('SQS_QUEUE_URL');
  }

  private isSQSEnabled(): boolean {
    return this.configService.get<string>('ENABLE_SQS') !== 'false';
  }

  async onModuleInit() {
    if (!this.isSQSEnabled()) {
      this.logger.log('SQS is disabled. Skipping listener setup.');
      return;
    }
    this.setupConsumer();
    await this.startListening();
  }

  async onModuleDestroy() {
    if (this.consumer) {
      await this.consumer.stop();
    }
  }

  private setupConsumer() {
    this.consumer = Consumer.create({
      queueUrl: this.sqsQueueUrl,
      sqs: this.sqsBaseService.getSQSClient(),
      handleMessage: async (message) => {
        try {
          await this.processMessage(message);

          return message;
        } catch (error) {
          this.logger.error(`Error processing message: ${error.message}`, {
            messageId: message.MessageId,
            error,
          });
          throw error; // This will prevent message deletion and allow retry
        }
      },
      batchSize: 10,
      visibilityTimeout: 30,
      messageSystemAttributeNames: ['ApproximateReceiveCount'],
      messageAttributeNames: ['jobType'], //can fetch custom attributes. if set as 'All', all attributes will be fetched
    });

    this.consumer.on('error', (err) => {
      this.logger.error('Error in SQS consumer:', err);
    });

    this.consumer.on('processing_error', (err) => {
      this.logger.error('Processing error in SQS consumer:', err);
    });
  }

  private async startListening() {
    this.logger.log('Starting SQS message listener...');
    await this.consumer.start();
    this.logger.log('SQS listener started successfully');
  }

  private async processMessage(message: Message) {
    try {
      const payload = JSON.parse(message.Body);
      // can skip message attributes if only one type of job is there
      const jobType = message?.MessageAttributes?.jobType?.StringValue;
      const approximateReceiveCount = message?.Attributes?.ApproximateReceiveCount;
      this.logger.log(
        `Processing message: ${message.MessageId} approximateReceiveCount` +
          `: ${approximateReceiveCount}
        `,
      );

      await this.sqsHandlerService.handleQueueJob(payload, jobType);

      // Here you can implement your message processing logic
      // For example, you might want to emit events or call specific services based on the message type

      this.logger.log(`Successfully processed message: ${message.MessageId}`);
    } catch (error) {
      this.logger.error(`Error processing message payload: ${error.message}`);
      throw error;
    }
  }
}
