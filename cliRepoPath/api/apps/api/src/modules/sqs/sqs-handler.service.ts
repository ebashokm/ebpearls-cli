import { Injectable, Logger } from '@nestjs/common';
import { SQSQueueJob } from './enum/sqs.enum';

@Injectable()
export class SQSHandlerService {

 private readonly logger = new Logger(SQSHandlerService.name);

  async handleQueueJob(data: any, jobType: string) {
    this.logger.log('Job received', JSON.stringify(data));
    this.logger.log('Job type', jobType);
    // Implement job handling logic here
    switch (jobType) {
      case SQSQueueJob.TEST_SQS_JOB:
        //const { eventId } = data;
        this.logger.log(`Processing TEST_SQS_JOB job`);
        // call your service method here
        break;
     
      default:
        throw new Error(`Unknown job type: ${jobType}`);
    }
  }
  
}