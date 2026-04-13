import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { CardListReponse } from './dto/response/card-list.response';
import { CreatePaymentInput } from './dto/input/create-payment.input';
import { EphemeralKeyResponse } from './dto/response/get-ephemeral-key.response';
import { StripePaymentService } from './services/stripe-payment.service';
import { MessageResponse } from '@app/common/dto/response/message.response';
import {
  PaginatedPaymentHistoryResponse,
  PaymentHistoryResponse,
} from './dto/response/payment-history.response';
import { ParseObjectIdPipe } from '@app/common/pipe/parse-mongoid.pipe';
import { PaymentHistoryInput } from './dto/input/payment-history.input';
import { LoginDetail } from '@api/modules/auth/decorator/login.decorator';
import { LoginDetailType } from '@api/modules/auth/types/login-detail.type';
import { TermsGuard } from '@api/guards/terms.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { SetupIntentResponse } from './dto/response/setup-intent.response';
import { SavePaymentMethodDto } from '@app/common/dto/input/save-payment-method.input';
import { ListPaymentMethodResponse } from '@app/common/dto/response/list-payment-methods.response';
import { DeletePaymentMethodInput } from './dto/input/delete-paymentMethod.input';
import { MakePaymentMethodDefaultInput } from './dto/input/make-card-default.input';

/**
 * Description placeholder
 *
 * @export
 * @class StripePaymentResolver
 * @typedef {StripePaymentResolver}
 */
@Resolver()
@UseGuards(AuthUserGuard, TermsGuard)
export class StripePaymentResolver {
  /**
   * Creates an instance of StripePaymentResolver.
   *
   * @constructor
   * @param {StripePaymentService} stripePaymentService
   */
  constructor(private readonly stripePaymentService: StripePaymentService) {}

  /**
   * Create setup intent for customer so that they can add payment methods later on
   * input is  card or au_bank
   * @param kind
   * @param loginDetail
   * @returns
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => SetupIntentResponse, {
    name: 'createIntentForCustomer',
    description: 'Setup intent for adding payment method.',
  })
  async createIntentForCustomer(
    @Args('kind', { nullable: true }) kind: 'card' | 'au_bank',
    @LoginDetail() user,
  ) {
    return this.stripePaymentService.createSetupIntent(user, kind);
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {SavePaymentMethodDto} input
   * @param {*} user
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => String, {
    name: 'savePaymentMethod',
    description: 'Save payment method.',
  })
  async savePaymentMethod(
    @Args('input') input: SavePaymentMethodDto,
    @LoginDetail() user: LoginDetailType,
  ) {
    return this.stripePaymentService.savePaymentMethod(input, user);
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {*} user
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Query(() => ListPaymentMethodResponse, {
    name: 'getMyPaymentMethods',
    description: 'List available payment methods of the user.',
  })
  async getMyPaymentMethods(@LoginDetail() user) {
    return await this.stripePaymentService.getMyPaymentMethods(user);
  }

  /**
   * Add credit card for user
   * input is card token
   * @param body
   * @param loginDetail
   * @returns
   */
  // @Mutation(() => MessageResponse)
  // async addCardFromToken(
  //   @Args('body') body: CreateCardInput,
  //   @LoginDetail() loginDetail: LoginDetailType,
  //   @I18n() i18n: I18nContext,
  // ) {
  //   try {
  //     const { card_token } = body;
  //     await this.stripePaymentService.addCardFromToken({
  //       cardToken: card_token,
  //       userId: loginDetail.userId,
  //     });
  //     return { message: i18n.t('stripe_payment.card_added_successfully') };
  //   } catch (e) {
  //     throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  /**
   * List available cards
   * @param loginDetail
   * @returns
   */

  @Query(() => [CardListReponse])
  async getCards(@LoginDetail() loginDetail: LoginDetailType) {
    try {
      return await this.stripePaymentService.getStripeCardsByUser(loginDetail.userId);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * List available cards
   * @param loginDetail
   * @returns
   */

  @Mutation(() => MessageResponse)
  async deleteCard(
    @Args('body') body: DeletePaymentMethodInput,
    @LoginDetail() loginDetail: LoginDetailType,
    @I18n() i18n: I18nContext,
  ) {
    try {
      const { paymentMethodId } = body;

      await this.stripePaymentService.deleteCard({
        userId: loginDetail.userId,
        paymentMethodId,
      });
      return { message: i18n.t('stripe_payment.card_removed_successfully') };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Make card default
   * @param body
   * @param loginDetail
   * @returns
   */

  @Mutation(() => MessageResponse)
  async makeCardDefault(
    @Args('body') body: MakePaymentMethodDefaultInput,
    @LoginDetail() loginDetail: LoginDetailType,
    @I18n() i18n: I18nContext,
  ) {
    try {
      const { paymentMethodId } = body;

      await this.stripePaymentService.makeCardDefault(loginDetail.userId, paymentMethodId);
      return { message: i18n.t('stripe_payment.card_made_default') };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {CreatePaymentInput} body
   * @param {LoginDetailType} loginDetail
   * @returns {unknown}
   */
  @Mutation(() => MessageResponse)
  async createPayment(
    @Args('body') body: CreatePaymentInput,
    @LoginDetail() loginDetail: LoginDetailType,
  ) {
    try {
      return await this.stripePaymentService.createPayment(loginDetail?.userId, body);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {LoginDetailType} loginDetail
   * @returns {unknown}
   */
  @Query(() => EphemeralKeyResponse)
  async getEphemeralKey(@LoginDetail() loginDetail: LoginDetailType) {
    try {
      return await this.stripePaymentService.getEphemeralKey(loginDetail.userId);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {PaymentHistoryInput} input
   * @param {LoginDetailType} loginDetail
   * @returns {unknown}
   */
  @Mutation(() => PaginatedPaymentHistoryResponse)
  async getMyPaymentHistory(
    @Args('input') input: PaymentHistoryInput,
    @LoginDetail() loginDetail: LoginDetailType,
  ) {
    return this.stripePaymentService.getPaymentHistoryOfUser(loginDetail.userId, input);
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @param {*} user
   * @returns {unknown}
   */
  @Mutation(() => PaymentHistoryResponse, { nullable: true })
  async getPaymentDetail(@Args('id', new ParseObjectIdPipe()) id: string, @LoginDetail() user) {
    return this.stripePaymentService.getPaymentDetail(id, user.userId);
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {LoginDetailType} loginDetail
   * @returns {unknown}
   */
  @Mutation(() => MessageResponse)
  async requestPayout(@LoginDetail() loginDetail: LoginDetailType) {
    return this.stripePaymentService.proceedStripePayout(loginDetail.userId);
  }
}
