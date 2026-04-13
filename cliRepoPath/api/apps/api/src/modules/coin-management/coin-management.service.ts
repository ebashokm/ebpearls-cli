import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddCoinPackageInput } from './dto/input/add-coin-package.input';
import { S3Service } from '@app/common/services/s3';
import { UsersRepository, CoinPackageRepository, CoinPurchaseRepository } from '@app/data-access';
import { InappSubscriptionService } from '@app/inapp-subscription';
import { PurchasePlatform } from '../subscription/enum/subscription-platform.enum';
import { AndroidReceiptConsumable } from './dto/input/android-consumable.input';
import { SignedUrlMethod } from '@app/common/enum/signed-url.enum';
import { IosReceiptConsumable } from './dto/input/ios-consumable.input';
import { ListCoinPackageResponse } from './dto/response/list-coin-package.response';
import { I18nService } from 'nestjs-i18n';
import { ENVIRONMENT } from './constants';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CoinManagementService
 * @typedef {CoinManagementService}
 */
@Injectable()
export class CoinManagementService {
  /**
   * Creates an instance of CoinManagementService.
   *
   * @constructor
   * @param {CoinPackageRepository} coinPackagesRepository
   * @param {CoinPurchaseRepository} coinPurchasesRepository
   * @param {UsersRepository} userRepository
   * @param {S3Service} s3Service
   * @param {InappSubscriptionService} iap
   */
  constructor(
    private readonly coinPackagesRepository: CoinPackageRepository,
    private readonly coinPurchasesRepository: CoinPurchaseRepository,
    private readonly userRepository: UsersRepository,
    private readonly s3Service: S3Service,
    private readonly iap: InappSubscriptionService,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {AddCoinPackageInput} addCoinPackageInput
   * @returns {Promise<{ message: any; }>\}
   */
  async addCoinPackage(addCoinPackageInput: AddCoinPackageInput) {
    const { appleProductId, androidProductId } = addCoinPackageInput;
    try {
      if (!appleProductId && !androidProductId)
        throw new BadRequestException(this.i18nService.t('coin_management.product_id_reqiured'));

      await this.coinPackagesRepository.updateOne(
        { numberOfCoins: addCoinPackageInput.numberOfCoins },
        { ...addCoinPackageInput },
        { upsert: true },
      );
      return { message: this.i18nService.t('coin_management.coin_added_successfully') };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<ListCoinPackageResponse>}
   */
  async getAllCoinPackages(): Promise<ListCoinPackageResponse> {
    try {
      const data = await this.coinPackagesRepository.find({});
      const coinList = await Promise.all(
        data.map(async (coin) => {
          coin.icon = await this.s3Service.getPreSignedUrl(coin.icon, SignedUrlMethod.GET);
          return coin;
        }),
      );
      return {
        message: this.i18nService.t('coin_management.coin_listed_successfully'),
        data: coinList as any,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} packageId
   * @returns {Promise<any>}
   */
  async getCoinPackage(packageId: string) {
    try {
      const coin = await this.coinPackagesRepository.findById(packageId);
      if (!coin) {
        throw new NotFoundException(this.i18nService.t('coin_management.coin_pack_not_found'));
      }
      coin.icon = await this.s3Service.getPreSignedUrl(coin.icon, SignedUrlMethod.GET);

      return coin;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} productId
   * @returns {Promise<any>}
   */
  async getCoinPackageByProductId(productId: string) {
    try {
      const coinPackage = await this.coinPackagesRepository.findOne({
        $or: [{ appleProductId: { $eq: productId } }, { androidProductId: { $eq: productId } }],
      });

      if (!coinPackage) {
        throw new BadRequestException(this.i18nService.t('coin_management.coin_pack_not_found'));
      }

      return coinPackage;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} user
   * @param {IosReceiptConsumable} payload
   * @returns {Promise<boolean>}
   */
  async verifyIOSPurchase(user, payload: IosReceiptConsumable) {
    try {
      const checkValid = await this.coinPurchasesRepository.findOne({
        receipt: payload.receipt,
      });

      if (checkValid && checkValid._id) {
        throw new HttpException(
          this.i18nService.t('coin_management.receipt_already_verified'),
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      const data = await this.iap.validateIosReceipt(payload.receipt);
      if (data instanceof Error) {
        throw new HttpException(
          data?.message || this.i18nService.t('coin_management.receipt_error'),
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const validatedData = data?.validatedData;
      const purchasedData = data?.validatedData?.receipt?.in_app[0];

      // validationResponse contains sandbox: true/false for Apple and Amazon
      // Android we don't know if it was a sandbox account
      const environment = validatedData.sandbox ? ENVIRONMENT.SANDBOX : ENVIRONMENT.PRODUCTION;
      const coinPackage = await this.getCoinPackageByProductId(purchasedData?.product_id);

      await this.coinPurchasesRepository.updateOne(
        {
          userId: user.userId.toString(),
          productId: purchasedData?.product_id,
        },
        {
          purchasePlatform: PurchasePlatform.IOS,
          receipt: payload.receipt,
          productId: purchasedData?.product_id,
          originalTransactionId: purchasedData?.original_transaction_id,
          transactionId: purchasedData?.transaction_id,
          environment,
          coins: coinPackage.numberOfCoins,
        },
        {
          upsert: true,
        },
      );
      await this.userRepository.updateOne(
        { _id: user.userId },
        {
          $inc: {
            'userStatistics.totalTokensCollected': coinPackage.numberOfCoins,
          },
        },
      );
      return true;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} user
   * @param {AndroidReceiptConsumable} payload
   * @returns {Promise<void>}
   */
  async verifyAndroidPurchase(user, payload: AndroidReceiptConsumable) {
    try {
      const checkValid = await this.coinPurchasesRepository.findOne({
        receipt: payload.purchaseToken,
      });

      if (checkValid && checkValid._id) {
        throw new HttpException(
          this.i18nService.t('coin_management.receipt_already_verified'),
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      const data = await this.iap.validateAndroidReceipt(payload);
      if (data instanceof Error) {
        throw new HttpException(
          data?.message || this.i18nService.t('coin_management.receipt_error'),
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const purchasedData = data?.purchaseData[0];

      // validationResponse contains sandbox: true/false for Apple and Amazon
      // Android we don't know if it was a sandbox account
      const coinPackage = await this.getCoinPackageByProductId(purchasedData?.productId);
      // else found update with lates info
      await this.coinPurchasesRepository.updateOne(
        {
          userId: user.userId.toString(),
          productId: purchasedData?.productId,
        },
        {
          purchasePlatform: PurchasePlatform.ANDROID,
          receipt: payload.purchaseToken,
          productId: purchasedData?.productId,
          // originalTransactionId: purchasedData?.original_transaction_id,
          transactionId: purchasedData?.transactionId,
          coins: coinPackage.numberOfCoins,
        },
        {
          upsert: true,
        },
      );

      await this.userRepository.updateOne(
        { _id: user.userId },
        {
          $inc: {
            'userStatistics.totalTokensCollected': coinPackage.numberOfCoins,
          },
        },
      );
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
