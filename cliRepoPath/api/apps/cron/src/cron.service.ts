import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { DisposableEmailService } from './services/disposable-email.service';
import { StripePaymentService } from './services/stripe-payment.service';
import { CronJob } from 'cron';
import { SentryTraced } from '@sentry/nestjs';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CronService
 * @typedef {CronService}
 */
@Injectable()
export class CronService {
  /**
   * ${1:Description placeholder}
   *
   * @private
   * @readonly
   * @type {*}
   */
  private readonly logger = new Logger(CronService.name);
  /**
   * Creates an instance of CronService.
   *
   * @constructor
   * @param {DisposableEmailService} disposableEmailService
   * @param {StripePaymentService} stripePaymentService
   */
  constructor(
    private readonly disposableEmailService: DisposableEmailService,
    private readonly stripePaymentService: StripePaymentService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<void>}
   */
  @Cron(CronExpression.EVERY_WEEK)
  @SentryTraced()
  async handleUpdateDisposableEmails() {
    this.logger.debug(
      '****************** Starting to update list of disposable email domains in database  ------ called every first day of the week.*********************',
    );
    await this.disposableEmailService.bulkUpdate();
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<void>}
   */
  @Cron(CronExpression.EVERY_WEEK)
  @SentryTraced()
  async handleStripePayout() {
    this.logger.debug(
      '****************** Starting to payout to stripe business accounts  ------ called every first day of the week.*********************',
    );
    await this.stripePaymentService.proceedStripePayout();
  }

  async cronTest() {
    //minute
    const job = new CronJob(`0 0 * * * *`, () => {
      this.cronTestDetail();
    });

    this.schedulerRegistry.addCronJob('archiveOrder', job);
    job.start();
  }

  async cronTestDetail() {
    this.logger.debug('****************** Cron Test ********************');
  }
}
