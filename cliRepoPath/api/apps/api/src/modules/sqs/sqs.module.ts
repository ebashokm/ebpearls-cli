import { Module } from '@nestjs/common';
import { SQSResolver } from './sqs.resolver';
import { SQSHandlerService } from './sqs-handler.service';
import { SqsBaseService } from '@app/common/services/sqs';
import { SqsListenerService } from './sqs-listener.service';


@Module({
  providers: [SQSResolver,SQSHandlerService,SqsBaseService,SqsListenerService],
  
})
export class SQSModule {}
