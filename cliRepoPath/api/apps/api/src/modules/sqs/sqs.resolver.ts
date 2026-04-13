import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { SqsBaseService } from '@app/common/services/sqs';
import { SQSQueueJob } from './enum/sqs.enum';
import { SendToQueueInput } from './dto/input/send-to-queue.input';
import { UseGuards } from '@nestjs/common';
import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { I18n, I18nContext } from 'nestjs-i18n';

@Resolver()
@UseGuards(AuthUserGuard)
export class SQSResolver {
  constructor(private sqsBaseService: SqsBaseService) {}

  @Mutation(() => String)
  async sendToQueue(
    @Args('payload') payload: SendToQueueInput,
    @I18n() i18n: I18nContext,
  ): Promise<string> {
    await this.sqsBaseService.sendMessage(payload, SQSQueueJob.TEST_SQS_JOB);
    return i18n.t('common.message_sent_to_sqs');
  }

  @Mutation(() => String)
  async sendToQueueError(
    @Args('payload') payload: SendToQueueInput,
    @I18n() i18n: I18nContext,
  ): Promise<string> {
    await this.sqsBaseService.sendMessage(payload, SQSQueueJob.TEST_ERROR_JOB);
    return i18n.t('common.message_sent_to_sqs');
  }
}
