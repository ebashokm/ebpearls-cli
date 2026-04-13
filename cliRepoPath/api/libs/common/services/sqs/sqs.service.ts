import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
  SendMessageBatchCommand,
  SendMessageBatchCommandInput,
  SendMessageBatchRequestEntry,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
} from '@aws-sdk/client-sqs';

@Injectable()
export class SqsBaseService {
  private readonly sqs: SQSClient;
  private readonly logger = new Logger(SqsBaseService.name);
  private readonly queueUrl: string;

  constructor(
    private configService: ConfigService,
  ) {
    this.sqs = new SQSClient({
      region: this.configService.get<string>('SQS_AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('SQS_AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('SQS_AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.queueUrl = this.configService.get<string>('SQS_QUEUE_URL') || '';
  }

  getSQSClient(): SQSClient {
    return this.sqs;
  }

  private isSQSEnabled(): boolean {
    return this.configService.get<string>('ENABLE_SQS') !== 'false';
  }

  async sendMessage(
    messageBody: any,
    jobType: string,
    customQueueUrl?: string,
    delayInMinutes: number = 0,
  ): Promise<void> {
    if (!this.isSQSEnabled()) {
      this.logger.log('SQS is disabled. Skipping message send.');
      return;
    }
    try {
      const input: SendMessageCommandInput = {
        QueueUrl: customQueueUrl || this.queueUrl,
        MessageBody: JSON.stringify(messageBody),
        MessageAttributes: {
          jobType: {
            DataType: 'String',
            StringValue: jobType,
          },
          eventId: { DataType: 'String', StringValue: messageBody.eventId || 'N/A' },
        },
        DelaySeconds: delayInMinutes * 60,
      };

      const command = new SendMessageCommand(input);
      await this.sqs.send(command);

      this.logger.log(`Message sent to SQS queue: ${this.queueUrl}`);
    } catch (error) {
      this.logger.error(`Error sending message to SQS: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendMessageBatch(messages: any[]): Promise<void> {
    try {
      const entries: SendMessageBatchRequestEntry[] = messages.map((message, index) => ({
        Id: `msg${index}`,
        MessageBody: JSON.stringify(message),
      }));

      // SQS only allows sending up to 10 messages in a batch
      for (let i = 0; i < entries.length; i += 10) {
        const batch = entries.slice(i, i + 10);
        const input: SendMessageBatchCommandInput = {
          QueueUrl: this.queueUrl,
          Entries: batch,
        };

        const command = new SendMessageBatchCommand(input);
        await this.sqs.send(command);
      }

      this.logger.log(
        `Batch of ${messages.length} messages sent to SQS queue: ${this.queueUrl}`,
      );
    } catch (error) {
      this.logger.error(`Error sending batch messages to SQS: ${error.message}`, error.stack);
      throw error;
    }
  }

  async receiveMessages(queueUrl: string, maxMessages: number = 10): Promise<Message[]> {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: maxMessages,
        WaitTimeSeconds: 20, // Long polling
        VisibilityTimeout: 30, // 30 seconds to process the message
      });

      const response = await this.sqs.send(command);
      return response.Messages || [];
    } catch (error) {
      this.logger.error(`Error receiving messages from SQS: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      });

      await this.sqs.send(command);
      this.logger.debug(`Message deleted from queue: ${receiptHandle}`);
    } catch (error) {
      this.logger.error(`Error deleting message from SQS: ${error.message}`, error.stack);
      throw error;
    }
  }

}
