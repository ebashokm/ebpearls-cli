import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CoinManagementService } from './coin-management.service';
import { AuthUserGuard } from '../../guards/auth.user.guard';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { UseGuards } from '@nestjs/common';
import { AddCoinPackageInput } from './dto/input/add-coin-package.input';
import { LoginDetail } from '../auth/decorator/login.decorator';
import { ListCoinPackageResponse } from './dto/response/list-coin-package.response';
import { CoinPackageResponse } from './dto/response/coin-package.response';
import { GetCoinPackageInput } from './dto/input/get-coin-package.input';
import { LoginDetailType } from '../auth/types/login-detail.type';
import { IosReceiptConsumable } from './dto/input/ios-consumable.input';
import { AndroidReceiptConsumable } from './dto/input/android-consumable.input';
import { TermsGuard } from '@api/guards/terms.guard';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CoinManagementResolver
 * @typedef {CoinManagementResolver}
 */
@Resolver()
@UseGuards(AuthUserGuard, TermsGuard)
export class CoinManagementResolver {
  /**
   * Creates an instance of CoinManagementResolver.
   *
   * @constructor
   * @param {CoinManagementService} coinManagementService
   */
  constructor(private readonly coinManagementService: CoinManagementService) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {AddCoinPackageInput} addCoinPackageInput
   * @returns {Promise<{ message: any; }>\}
   */
  @Mutation(() => MessageResponse)
  async addCoinPackage(@Args('body') addCoinPackageInput: AddCoinPackageInput) {
    return this.coinManagementService.addCoinPackage(addCoinPackageInput);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<ListCoinPackageResponse>}
   */
  @Query(() => ListCoinPackageResponse, { nullable: true })
  async getAllCoinPackages() {
    return await this.coinManagementService.getAllCoinPackages();
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetCoinPackageInput} param0
   * @param {GetCoinPackageInput} param0.id
   * @returns {Promise<any>}
   */
  @Query(() => CoinPackageResponse)
  async getCoinPackage(@Args('body') { id }: GetCoinPackageInput) {
    return await this.coinManagementService.getCoinPackage(id);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {LoginDetailType} loginDetail
   * @param {IosReceiptConsumable} iosPayload
   * @param {AndroidReceiptConsumable} androidPayload
   * @returns {Promise<boolean | void>}
   */
  @Mutation(() => Boolean)
  async verifyPurchaseCoinPackages(
    @LoginDetail() loginDetail: LoginDetailType,
    @Args('iosPayload', { nullable: true }) iosPayload: IosReceiptConsumable,
    @Args('androidPayload', { nullable: true })
    androidPayload: AndroidReceiptConsumable,
  ) {
    if (iosPayload?.receipt) {
      return this.coinManagementService.verifyIOSPurchase(loginDetail, iosPayload);
    }
    return this.coinManagementService.verifyAndroidPurchase(loginDetail, androidPayload);
  }
}
