import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { I18n, I18nContext } from 'nestjs-i18n';
import Stripe from 'stripe';
import { LoginDetail } from '../../auth/decorator/login.decorator';
import { LoginDetailType } from '../../auth/types/login-detail.type';
import {
  CreateBankAccountInput,
  CreateBankAccountLinkInput,
  CreateOnboardingAccountLinkInput,
} from './dto/input/create-bank-detail.input';
import { CreateBankDetailInput, CreateBankTokenInput } from './dto/input/create-bank.input';
import {
  CreateConnectAccountResponse,
  CreateCompanyBankAccountLinkResponse as CreateOnboardingAccountLinkResponse,
  StripeConnectAccountReponse,
} from './dto/response/connect-account.response';
import { LinkBankAccountResponse } from './dto/response/link-bank-account.response';
import { StripeConnectService } from './stripe-connect.service';

/**
 * Description placeholder
 *
 * @export
 * @class StripeConnectResolver
 * @typedef {StripeConnectResolver}
 */
@Resolver()
export class StripeConnectResolver {
  /**
   * Creates an instance of StripeConnectResolver.
   *
   * @constructor
   * @param {StripeConnectService} stripeConnectService
   */
  constructor(private readonly stripeConnectService: StripeConnectService) {}

  /**
   * For creating custom account from custom form
   *
   * @async
   * @param {CreateBankDetailInput} body
   * @param {LoginDetailType} loginDetail
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => MessageResponse)
  async createCustomStripeAccount(
    @Args('body') body: CreateBankDetailInput,
    @LoginDetail() loginDetail: LoginDetailType,
  ): Promise<MessageResponse> {
    return this.stripeConnectService.createCustomStripeAccount(body, loginDetail.userId);
  }

  /**
   * For creating custom account link for onboarding on stripe
   *
   * @async
   * @param {*} user
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => CreateConnectAccountResponse)
  async generateCustomAccountOnboardingLink(
    @LoginDetail() { userId }: LoginDetailType,
    @Args('body') body: CreateBankAccountLinkInput,
    @I18n() i18n: I18nContext,
  ): Promise<{
    message: string;
    connectAccountId: string;
  }> {
    try {
      const res = await this.stripeConnectService.generateCustomAccountOnboardingLink(userId, body);
      return {
        message: i18n.t('stripe_connect.connect_account_success'),
        connectAccountId: res.id,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * For standard and express account link for onboarding on stripe
   *
   * @async
   * @param {CreateBankAccountLinkInput} body
   * @param {*} user
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => LinkBankAccountResponse, {
    name: 'generateAccountOnboardingLink',
    description: 'Links business owner to the stripe as connected standard account.',
  })
  async generateAccountOnboardingLink(
    @Args('body') body: CreateBankAccountLinkInput,
    @LoginDetail() { userId }: LoginDetailType,
  ): Promise<Stripe.Response<Stripe.AccountLink>> {
    return this.stripeConnectService.generateAccountOnboardingLink(userId, body);
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {CreateBankAccountInput} body
   * @param {*} user
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => MessageResponse)
  async addUserBankAccountFromToken(
    @Args('body') body: CreateBankAccountInput,
    @LoginDetail() { userId }: LoginDetailType,
    @I18n() i18n: I18nContext,
  ): Promise<{
    message: string;
  }> {
    await this.stripeConnectService.addUserBankAccountFromToken(userId, body);

    return { message: i18n.t('stripe_connect.bank_account_added_success') };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {CreateBankAccountInput} body
   * @param {*} user
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => MessageResponse)
  async addUserBankAccountFromDetail(
    @Args('body') body: CreateBankTokenInput,
    @LoginDetail() { userId }: LoginDetailType,
    @I18n() i18n: I18nContext,
  ): Promise<{
    message: string;
  }> {
    await this.stripeConnectService.addUserBankAccountFromDetail(userId, body);

    return { message: i18n.t('stripe_connect.bank_account_added_success') };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} bankId
   * @param {*} user
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => MessageResponse)
  async deleteUserBankAccount(
    @Args('bankId') bankId: string,
    @LoginDetail() { userId }: LoginDetailType,
    @I18n() i18n: I18nContext,
  ): Promise<{
    message: string;
  }> {
    await this.stripeConnectService.deleteUserBankAccount(userId, bankId);
    return {
      message: i18n.t('stripe_connect.bank_account_removed'),
    };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} bankId
   * @param {*} user
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => MessageResponse)
  async updateDefaultBankAccount(
    @Args('bankId') bankId: string,
    @LoginDetail() { userId }: LoginDetailType,
    @I18n() i18n: I18nContext,
  ): Promise<{
    message: string;
  }> {
    await this.stripeConnectService.updateDefaultBankAccount(userId, bankId);
    return {
      message: i18n.t('stripe_connect.bank_account_set_default'),
    };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} bankId
   * @param {*} user
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => MessageResponse)
  async deleteStripeConnectAccount(
    @Args('connectAccountId') connectAccountId: string,
    @LoginDetail() { userId }: LoginDetailType,
    @I18n() i18n: I18nContext,
  ): Promise<{
    message: string;
  }> {
    await this.stripeConnectService.deleteStripeConnectAccount(userId, connectAccountId);
    return {
      message: i18n.t('stripe_connect.bank_account_removed'),
    };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {LoginDetailType} loginDetail
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Query(() => StripeConnectAccountReponse, { nullable: true })
  async getUserStripeAccountDetails(@LoginDetail() loginDetail: LoginDetailType) {
    return await this.stripeConnectService.getUserStripeAccountDetails(loginDetail.userId);
  }

  @UseGuards(AuthUserGuard)
  @Query(() => CreateOnboardingAccountLinkResponse, { nullable: false })
  async createOnboardingAccountLink(
    @LoginDetail() loginDetail: LoginDetailType,
    @Args('body') body: CreateOnboardingAccountLinkInput,
  ) {
    return await this.stripeConnectService.createOnboardingAccountLink(loginDetail.userId, body);
  }
}
