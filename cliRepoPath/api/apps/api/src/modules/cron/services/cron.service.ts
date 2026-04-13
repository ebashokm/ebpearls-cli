import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StripePaymentService } from '@api/modules/stripe/stripe-payment/services/stripe-payment.service';
import { DisposableEmailService } from './disposable-email.service';

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
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<void>}
   */
  @Cron(CronExpression.EVERY_WEEK)
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
  async handleStripePayout() {
    this.logger.debug(
      '****************** Starting to payout to stripe business accounts  ------ called every first day of the week.*********************',
    );
    await this.stripePaymentService.proceedStripePayout();
  }
}
