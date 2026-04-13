import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { AndroidReceipt, IosReceipt } from './dto/input/validate-receipt.input';
import { PurchasePlatform } from './enum/subscription-platform.enum';
import * as jwt from 'jsonwebtoken';
import { InappSubscriptionService } from '@app/inapp-subscription';
import { SubscriptionStatus } from './enum/subscription-status.enum';
import { I18nService } from 'nestjs-i18n';
import { ENVIRONMENT, NOTIFICATION_TYPE } from './constants';
import { LoginDetailType } from '../auth/types/login-detail.type';
import {
  SubscriptionLogRepository,
  UsersRepository,
  UserSubscriptionRepository,
} from '@app/data-access';
import { SubscribeDtoV2 } from './dto/input/subscription-v2.input';

import { randomUUID } from 'crypto';
import * as crypto from 'crypto';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SubscriptionService
 * @typedef {SubscriptionService}
 */
@Injectable()
export class SubscriptionService {
  constructor(
    private readonly iap: InappSubscriptionService,
    private readonly subscriptionRepository: UserSubscriptionRepository,
    private readonly userRepository: UsersRepository,
    private readonly subscriptionLogRepo: SubscriptionLogRepository,
    private readonly i18nService: I18nService,
  ) {}

  private generateIosSubscriptionData(purchasedData: any, environment) {
    return {
      purchasePlatform: PurchasePlatform.IOS,
      isTrailPeriod: !!purchasedData?.isTrial,
      autoRenewStatus: !!purchasedData?.autoRenewing,
      originalTransactionId: purchasedData?.originalTransactionId,
      environment,
      purchaseDate: purchasedData?.originalPurchaseDateMs
        ? new Date(purchasedData?.originalPurchaseDateMs)
        : null,
      cancellationDate: purchasedData?.cancellationDate
        ? new Date(purchasedData?.cancellationDate)
        : null,
      expirationDate: purchasedData?.expiresDateMs ? new Date(purchasedData?.expiresDateMs) : null,
      transactionId: purchasedData?.transactionId,
      packageName: purchasedData?.productId,
    };
  }

  private searchSubscription(condition) {
    return this.subscriptionRepository.findOne(condition);
  }

  private generateLogData(user, purchasedData, metaData, membershipAppliedAt) {
    return {
      userId: user.userId,
      username: user.authProviderId || '',
      transactionId: purchasedData?.transactionId,
      amount: metaData.price || 0,
      subscriptionFrequency: '',
      subscriptionStatus: SubscriptionStatus.COMPLETED,
      membershipAppliedAt,
    };
  }

  private async updatedSubscription(condition, data) {
    return await this.subscriptionRepository.updateOne(condition, data);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} user
   * @param {IosReceipt} receiptData
   * @returns {Promise<boolean>}
   */
  async verifyIosSubscription(user, receiptData: IosReceipt) {
    try {
      const { receipt } = receiptData;
      const data = await this.iap.validateIosReceipt(receipt);

      if (data instanceof Error) {
        throw new HttpException(
          data?.message || this.i18nService.t('subscription.receipt_error'),
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const purchasedData = data?.purchaseData[0];
      const validatedData = data?.validatedData;

      // validationResponse contains sandbox: true/false for Apple and Amazon
      // Android we don't know if it was a sandbox account
      const environment = validatedData.sandbox ? ENVIRONMENT.SANDBOX : ENVIRONMENT.PRODUCTION;

      const subscriptionData = this.generateIosSubscriptionData(purchasedData, environment);

      const subscription = await this.searchSubscription({
        productId: purchasedData?.productId,
        originalTransactionId: purchasedData?.originalTransactionId,
        expirationDate: { $gte: new Date() },
      });

      if (subscription) {
        // same user
        await this.updatedSubscription(
          {
            userId: user.userId,
            productId: purchasedData?.productId,
            originalTransactionId: purchasedData?.originalTransactionId,
          },
          {
            ...subscriptionData,
            receipt: receiptData.receipt,
            productId: purchasedData?.productId,
            transactionId: purchasedData?.transactionId,
          },
        );
      } else {
        // check if another user has already subscribed from this account
        const deviceSubscription = await this.searchSubscription({
          originalTransactionId: purchasedData?.originalTransactionId,
          userId: { $ne: user.userId },
        });

        if (deviceSubscription) {
          // not expired
          if (new Date(deviceSubscription.expirationDate) > new Date()) {
            throw new BadRequestException(
              this.i18nService.t('subscription.package_already_subscribed_from_this_account'),
            );
          } else {
            // expired
            await this.subscriptionRepository.updateOne(
              {
                originalTransactionId: purchasedData?.originalTransactionId,
              },
              {
                ...subscriptionData,
                userId: user.userId,
                receipt: receiptData.receipt,
                productId: purchasedData?.productId,
                transactionId: purchasedData?.transactionId,
              },
            );

            return true;
          }
        } else {
          // same user case
          // check if current user has subscribed the same package from another account
          const userSubscription = await this.subscriptionRepository.findOne({
            userId: user.userId,
            productId: purchasedData?.productId,
            expirationDate: { $gte: new Date() },
          });
          if (userSubscription) {
            throw new BadRequestException(
              this.i18nService.t('subscription.package_already_subscribed_from_another_account'),
            );
          }
          await this.subscriptionRepository.create({
            userId: user.userId,
            receipt: receiptData.receipt,
            productId: purchasedData?.productId,
            transactionId: purchasedData?.transactionId,
            ...subscriptionData,
          });
          // }
        }
      }

      const membershipAppliedAt = purchasedData?.purchaseDateMs
        ? new Date(purchasedData?.purchaseDateMs)
        : new Date();

      const logData = this.generateLogData(user, purchasedData, 0, membershipAppliedAt);

      const subscriptionPayload = this.getCurrentSubscriptionPayload(subscriptionData);

      await Promise.all([
        this.userRepository.updateOne(
          { _id: user.userId },
          {
            currentSubscription: {
              ...subscriptionPayload,
              isCancelled: !!purchasedData?.cancellationDate,
            },
          },
        ),

        this.subscriptionLogRepo.updateOne(
          {
            transactionId: purchasedData?.transactionId,
          },
          logData,
          { upsert: true },
        ),
      ]);
      // update user's current subscription

      return true;
    } catch (error: any) {
      throw error;
    }
  }

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Generates a payload containing the current subscription details.
   *
   * @param {object} info - The subscription information object.
   * @param {boolean} info.isTrailPeriod - Indicates if the subscription is in a trial period.
   * @param {Date} info.purchaseDate - The date when the subscription was purchased.
   * @param {Date} info.expirationDate - The date when the subscription expires.
   * @param {boolean} [info.isCancelled=false] - Indicates if the subscription is cancelled.
   * @param {Date} [info.cancellationDate] - The date when the subscription was cancelled, if applicable.
   * @param {string} info.packageName - The name of the subscription package.
   * @param {string} info.transactionId - The transaction ID related to the subscription.
   * @returns {object} The payload containing subscription details.
   */

  /*******  08ddff6a-f786-494c-b252-f3fe91bda055  *******/

  getCurrentSubscriptionPayload(info) {
    return {
      isTrailPeriod: info.isTrailPeriod,
      purchaseDate: info.purchaseDate,
      purchasePlatform: info.purchasePlatform,
      expirationDate: info.expirationDate,
      isCancelled: info?.isCancelled ?? false,
      cancellationDate: info?.cancellationDate,
      packageName: info.packageName,
      transactionId: info.transactionId,
      isAutoRenewing: info.autoRenewStatus,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} user
   * @param {AndroidReceipt} bodyData
   * @returns {Promise<boolean>}
   */
  async verifyAndroidSubscription(user, @Args('bodyData') bodyData: AndroidReceipt) {
    const packageName = bodyData.packageName;
    const subscriptionId = bodyData.subscriptionId;
    const token = bodyData.token;
    try {
      const data = await this.iap.validateAndroidReceipt({
        subscription: true,
        packageName,
        productId: subscriptionId,
        purchaseToken: token,
      });

      if (data instanceof Error) {
        throw new HttpException(
          data?.message || this.i18nService.t('subscription.receipt_error'),
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const purchaseData = data?.purchaseData[0];

      const transactionId = purchaseData?.purchaseToken;
      const productId = purchaseData?.lineItems?.[0]?.offerDetails?.basePlanId;
      const offerDetail = purchaseData?.lineItems?.[0];

      const subscriptionData = {
        purchasePlatform: PurchasePlatform.ANDROID,
        isTrailPeriod: !['monthly', 'annual'].includes(productId),
        autoRenewStatus: purchaseData?.lineItems?.[0]?.autoRenewingPlan?.autoRenewEnabled,
        originalTransactionId: transactionId,
        purchaseDate: new Date(purchaseData.startTime),
        expirationDate: new Date(purchaseData?.lineItems?.[0]?.expiryTime),
        packageName: productId,
        transactionId: token,
      };

      const subscription = await this.subscriptionRepository.findOne({
        userId: user.userId,
        productId,
        originalTransactionId: transactionId,
      });

      if (subscription) {
        // update with latest info
        await this.subscriptionRepository.updateOne(
          {
            userId: user.userId,
            productId: productId,
            originalTransactionId: transactionId,
          },
          {
            ...subscriptionData,
            productId: productId,
            receipt: token,
            transactionId: purchaseData?.orderId,
            packageName,
          },
        );
      } else {
        // if not found insert
        await this.subscriptionRepository.create({
          userId: user.userId,
          receipt: token,
          productId: productId,
          transactionId: purchaseData?.latestOrderId,
          packageName,
          ...subscriptionData,
        });
      }

      let priceAmount; // in cents
      const cents = offerDetail.autoRenewingPlan.recurringPrice.nanos / 1000000000;
      const amount = `${parseInt(offerDetail.autoRenewingPlan.recurringPrice.units) + cents}`;

      const membershipAppliedAt = new Date(purchaseData.startTime);
      const logData = {
        userId: user.userId,
        transactionId: purchaseData?.latestOrderId,
        subscriptionType: productId,
        amount: parseFloat(amount) || 0,
        subscriptionStatus: SubscriptionStatus.COMPLETED,
        membershipAppliedAt,
      };

      const subscriptionPayload = this.getCurrentSubscriptionPayload(subscriptionData);
      await Promise.all([
        this.subscriptionLogRepo.updateOne(
          {
            transactionId: purchaseData?.latestOrderId,
          },
          logData,
          { upsert: true },
        ),
        // update user's current subscription
        this.userRepository.updateOne(
          { _id: user.userId },
          {
            currentSubscription: {
              ...subscriptionPayload,
              // isCancelled: !!purchaseData?.cancellationDate,
            },
          },
        ),
      ]);

      return !!data;
    } catch (error: any) {
      throw error;
    }
  }

  decodeSignedPayload(data): any {
    try {
      const decodedData = jwt.decode(data);
      return decodedData;
    } catch (error) {
      throw new error();
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} data
   * @returns {Promise<string>}
   */

  async updateUserSubscription(transactionId: string, data: any) {
    try {
      const updatedUser = await this.userRepository.findOneAndUpdate(
        {
          'currentSubscription.transactionId': transactionId,
        },
        {
          ...data,
        },
        { new: true },
      );
      return updatedUser;
    } catch (error) {
      throw new error();
    }
  }
  async handleIosWebhook(data: any) {
    try {
      const parsedSignedPayload = this.decodeSignedPayload(data.signedPayload);
      const notification_type = parsedSignedPayload?.notificationType;

      const { data: decodedData } = parsedSignedPayload;
      const signedTransactionInfo = this.decodeSignedPayload(decodedData.signedTransactionInfo);

      let createLog, priceAmount, paymentStatus;

      switch (notification_type) {
        case notification_type.REFUND:
        case notification_type.REVOKE:
        case notification_type.EXPIRED:
          priceAmount = 0;
          createLog = true;
          paymentStatus = SubscriptionStatus.CANCELED;
          await this.subscriptionRepository.updateMany(
            {
              originalTransactionId: signedTransactionInfo.originalTransactionId,
              productId: signedTransactionInfo.productId,
            },
            {
              autoRenewStatus: false,
              cancellationDate: signedTransactionInfo?.cancellationDate
                ? new Date(signedTransactionInfo.cancellationDate)
                : new Date(),
              subscriptionStatus: false,
              notificationType: notification_type,
            },
          );
          break;
        case NOTIFICATION_TYPE.DID_RENEW:
        case NOTIFICATION_TYPE.DID_CHANGE_RENEWAL_PREF:
          priceAmount = 0;
          createLog = true;
          paymentStatus = SubscriptionStatus.COMPLETED;
          await this.subscriptionRepository.updateMany(
            {
              originalTransactionId: signedTransactionInfo.originalTransactionId,
              productId: signedTransactionInfo.productId,
            },
            {
              autoRenewStatus: true,
              subscriptionStatus: true,
              notificationType: notification_type,
            },
          );
          break;
        default:
          break;
      }
      await this.userRepository.updateOne(
        {
          'currentSubscription.transactionId': signedTransactionInfo?.originalTransactionId,
        },
        {
          $set: {
            'currentSubscription.isAutoRenewing': signedTransactionInfo?.isAutoRenewing,
            'currentSubscription.expirationDate':
              signedTransactionInfo?.expirationDate ??
              new Date(signedTransactionInfo?.expirationDate),
            'currentSubscription.isCancelled': signedTransactionInfo?.isCancelled,
            'currentSubscription.cancellationDate':
              signedTransactionInfo?.cancellationDate ??
              new Date(signedTransactionInfo?.cancellationDate),
            'currentSubscription.environment': signedTransactionInfo?.environment,
            'currentSubscription.isTrailPeriod': signedTransactionInfo?.isTrailPeriod,
          },
        },
      );
      // else if (notification_type)
      if (createLog) {
        const logData = {
          // userId: '', // need to determine
          username: '', // need to determine
          transactionId: signedTransactionInfo?.transactionId,
          amount: priceAmount,
          subscriptionFrequency: signedTransactionInfo?.productId,
          subscriptionStatus: paymentStatus,
          membershipAppliedAt: signedTransactionInfo?.purchaseDate
            ? new Date(signedTransactionInfo.purchaseDate)
            : new Date(),
        };

        await this.subscriptionLogRepo.updateOne(
          {
            transactionId: signedTransactionInfo?.transactionId,
          },
          logData,
          { upsert: true },
        );
      }

      return 'OK';
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} body
   * @returns {Promise<any>}
   */
  async handleAndroidWebhook(body: any) {
    try {
      console.log('====Web hook called', JSON.stringify(body));
      const encodedData = body.message.data;
      const decodedData = Buffer.from(`${encodedData}`, 'base64');
      const msgRetrive = JSON.parse(decodedData.toString());

      const packageName = msgRetrive.packageName;
      const subscriptionId = msgRetrive.subscriptionNotification.subscriptionId;
      const token = msgRetrive.subscriptionNotification.purchaseToken;
      const notification_type = msgRetrive.subscriptionNotification.notificationType;

      const data = await this.iap.validateAndroidReceipt({
        subscription: true,
        packageName,
        productId: subscriptionId,
        purchaseToken: token,
      });

      const purchaseData = data?.purchaseData[0];
      const lineItems = purchaseData?.lineItems?.[0];
      const cancelData = purchaseData?.canceledStateContext?.userInitiatedCancellation;

      let createLog, priceAmount, paymentStatus;

      switch (notification_type) {
        case 3:
          paymentStatus = SubscriptionStatus.CANCELED;
          createLog = true;
          priceAmount = 0;
          await this.subscriptionRepository.updateMany(
            {
              originalTransactionId: token,
              productId: lineItems.offerDetails.basePlanId,
            },
            {
              ...data,
              cancellationDate: new Date(),
              subscriptionStatus: false,
            },
          );

          break;
        case 2:
          paymentStatus = SubscriptionStatus.COMPLETED;
          createLog = true;
          await this.subscriptionRepository.updateMany(
            {
              originalTransactionId: token,
              productId: lineItems.offerDetails.basePlanId,
            },
            {
              ...data,
              expirationDate: lineItems?.expiryTime ? new Date(lineItems?.expiryTime) : null,
              subscriptionStatus: true,
              isTrailPeriod: false,
            },
          );

          break;
        case 7:
          paymentStatus = SubscriptionStatus.COMPLETED;
          createLog = true;
          await this.subscriptionRepository.updateMany(
            {
              originalTransactionId: token,
              productId: lineItems.offerDetails.basePlanId,
            },
            {
              ...data,
              expirationDate: lineItems?.expiryTime ? new Date(lineItems?.expiryTime) : null,
              cancellationDate: cancelData?.cancelTime ? new Date(cancelData.cancelTime) : null,
              subscriptionStatus: false,
            },
          );
          break;
        case 12:
        case 13:
          paymentStatus = SubscriptionStatus.EXPIRED;
          createLog = true;
          await this.subscriptionRepository.updateMany(
            {
              originalTransactionId: token,
              productId: lineItems.offerDetails.basePlanId,
            },
            {
              ...data,
              expirationDate: new Date(),
              subscriptionStatus: false,
            },
          );
          break;
        default:
          break;
      }
      await this.userRepository.updateOne(
        {
          'currentSubscription.transactionId': token,
        },
        {
          $set: {
            'currentSubscription.cancellationDate': cancelData?.cancelTime
              ? new Date(cancelData?.cancelTime)
              : null,
            'currentSubscription.expirationDate': lineItems?.expiryTime
              ? new Date(lineItems?.expiryTime)
              : null,
            'currentSubscription.subscriptionStatus':
              msgRetrive.subscriptionNotification.notificationType === 2 ? true : false,
            'currentSubscription.isCancelled':
              msgRetrive.subscriptionNotification.notificationType === 3 ? true : false,
          },
        },
      );

      if (createLog) {
        const subscriptionLog = await this.subscriptionLogRepo.findOne({
          transactionId: purchaseData.latestOrderId,
        });

        const logData = {
          userId: subscriptionLog.userId,
          transactionId: purchaseData?.latestOrderId,
          amount: priceAmount,
          subscriptionStatus: paymentStatus,
          membershipAppliedAt: new Date(purchaseData?.startTime),
        };

        await this.subscriptionLogRepo.create(logData);
      }
      return 'OK';
    } catch (error) {
      return error?.message;
    }
  }

  async subscribeV2(input: SubscribeDtoV2, loginDetail: LoginDetailType) {
    try {
      const { androidRecieptData, iosRecieptData, platform } = input;
      if (platform === 'ios') {
        await this.verifyIosSubscription(loginDetail, iosRecieptData);
      }
      if (platform === 'android') {
        await this.verifyAndroidSubscription(loginDetail, androidRecieptData);
      }

      return this.userRepository.findById(loginDetail.userId);
    } catch (error: any) {
      throw error;
    }
  }

  async createOfferSignature(
    appBundleId,
    applicationUsernameHash,
    productIdentifier,
    offerIdentifier,
  ) {
    try {
      const keyIdentifier = process.env.SUBSCRIPTION_KEY_IDENTIFIER;
      const privateKey = process.env.SUBSCRIPTION_PRIVATE_KEY;

      const nonce = randomUUID().toLowerCase();
      const timestamp = Date.now();

      const dataToSign = [
        appBundleId,
        keyIdentifier,
        productIdentifier,
        offerIdentifier,
        applicationUsernameHash,
        nonce,
        timestamp.toString(),
      ].join('\u2063');

      const sign = crypto.createSign('SHA256');
      sign.update(dataToSign);
      sign.end();

      const signature = sign.sign(privateKey, 'base64');

      return {
        signature,
        keyIdentifier,
        nonce,
        timestamp,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
