import {
  PaymentMethodDocument,
  PaymentMethodRepository,
  StripeCustomerRepository,
  UserDocument,
  UsersRepository,
} from '@app/data-access';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { STRIPE_API_VERSION, STRIPE_PAYOUT_INTERVAL } from '@api/constants';
import { UsersService } from '@api/modules/users/users.service';
import { SavePaymentMethodDto } from '@app/common/dto/input/save-payment-method.input';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { getDynamicDate } from '@app/common/helpers/genericFunction';
import { toMongoId } from '@app/common/helpers/mongo-helper';
import { StripeService } from '@app/stripe';
import { I18nService } from 'nestjs-i18n';
import { CreatePaymentInput } from '../dto/input/create-payment.input';
import { GetEphemeralKeyInput } from '../dto/input/get-ephemeral-key.input';
import { PaymentHistoryInput } from '../dto/input/payment-history.input';
import { EphemeralKeyResponse } from '../dto/response/get-ephemeral-key.response';
import { PaymentStatus } from '../enum/payment-status.enum';
import { StripePaymentLogRepository } from '../repository/stripe-payment-log.repository';
import { StripePaymentRepository } from '../repository/stripe-payment.repository';
import { CreateCardOnStripe } from '../types/create-card-on-stripe.type';
import { IPaymentIntentData } from '../types/payment-intent.type';
import {
  DeletePaymentMethod,
  DeletePaymentMethodFromStripe,
} from '../types/payment-method.stripe.type';
import { LoginDetailType } from '@api/modules/auth/types/login-detail.type';

/**
 * Description placeholder
 *
 * @type {"AUD"}
 */
const defaultCurrency = 'AUD';
/**
 * Description placeholder
 *
 * @export
 * @class StripePaymentService
 * @typedef {StripePaymentService}
 */
@Injectable()
export class StripePaymentService {
  /**
   * Creates an instance of StripePaymentService.
   *
   * @constructor
   * @param {StripeService} stripeService
   * @param {UsersService} usersService
   * @param {UsersRepository} usersRepo
   * @param {StripeCustomerRepository} stripeCustomerRepo
   * @param {PaymentMethodRepository} paymentMethodRepository
   * @param {StripePaymentRepository} stripePaymentRepo
   * @param {StripePaymentLogRepository} stripePaymentLogRepo
   * @param {I18nService} i18nService
   */
  constructor(
    private readonly stripeService: StripeService,
    private readonly usersService: UsersService,
    private readonly usersRepo: UsersRepository,
    private readonly stripeCustomerRepo: StripeCustomerRepository,
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly stripePaymentRepo: StripePaymentRepository,
    private readonly stripePaymentLogRepo: StripePaymentLogRepository,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * Description placeholder
   *
   * @async
   * @param {*} user
   * @param {('card' | 'au_bank')} kind
   * @returns {unknown}
   */
  async createSetupIntent(user, kind: 'card' | 'au_bank') {
    const stripeCustomer = await this.stripeCustomerRepo.findOne({
      userId: user?.userId,
    });
    let stripeCustomerId = null;
    if (!stripeCustomer) {
      const stripeCustomerResponse = await this.stripeService.createCustomer({
        description: `cus-${user?.userId}`,
      });
      stripeCustomerId = stripeCustomerResponse?.id;
      await this.stripeCustomerRepo.create({
        userId: user?.userId,
        customerId: stripeCustomerId,
      });
      await this.usersRepo.updateOne(
        { _id: user?.userId },
        {
          $set: {
            stripeCustomerId,
          },
        },
      );
    } else {
      stripeCustomerId = stripeCustomer?.customerId;
    }
    const intentResponse = await this.stripeService.createSetupIntent({
      customer: stripeCustomerId,
      ...(kind === 'au_bank' ? { payment_method_types: ['au_becs_debit'] } : {}),
    });

    return {
      clientSecret: intentResponse.client_secret,
    };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {SavePaymentMethodDto} input
   * @param {*} user
   * @returns {unknown}
   */
  async savePaymentMethod(input: SavePaymentMethodDto, user: LoginDetailType) {
    const userId = user?.userId;
    const clientDetail = await this.usersRepo.findOne({
      _id: toMongoId(userId),
    });

    if (!clientDetail) {
      throw new BadRequestException(this.i18nService.t('stripe_payment.user_not_found'));
    }

    await this.createAndMakeDefaultPaymentMethod(input.paymentMethod, clientDetail);
    return this.i18nService.t('stripe_payment.payment_method_created');
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} paymentMethodId
   * @param {*} user
   * @param {?Stripe.RequestOptions} [option]
   * @returns {unknown}
   */
  async createAndMakeDefaultPaymentMethod(
    paymentMethodId: string,
    user: UserDocument,
    option?: Stripe.RequestOptions,
  ) {
    if (!user?.stripeCustomerId) {
      const customer = await this.stripeService.createCustomer({
        description: `cus-${user._id.toString()}`,
      });
      user.stripeCustomerId = customer.id;
      await this.stripeCustomerRepo.create({ userId: user._id, customerId: customer.id });
      await user.save();
    }

    const existingCard = await this.paymentMethodRepository.findOne({
      userId: user._id,
      paymentMethodId: paymentMethodId,
    });

    if (existingCard) {
      throw new BadRequestException(this.i18nService.t('stripe_payment.card_already_exist'));
    }

    const userHaveCard = await this.paymentMethodRepository.findOne({
      userId: user._id,
    });

    const paymentMethod = await this.stripeService.retrievePaymentMethod(paymentMethodId, option);

    await this.stripeService.attachPaymentMethod(user?.stripeCustomerId, paymentMethodId);

    return await this.paymentMethodRepository.create({
      userId: user._id,
      paymentMethodId: paymentMethod?.id,
      paymentMethod: paymentMethod?.card?.brand ?? 'bank',
      country: paymentMethod?.card?.country,
      exp_month: paymentMethod?.card?.exp_month,
      exp_year: paymentMethod?.card?.exp_year,
      fingerprint: paymentMethod?.card?.fingerprint,
      funding: paymentMethod?.card?.funding,
      last4: paymentMethod?.card?.last4,
      metadata: paymentMethod?.metadata,
      name: paymentMethod?.billing_details?.name,
      is_default_source: !userHaveCard,
    });
  }

  /**
   * Description placeholder
   *
   * @private
   * @async
   * @param {string} stripeCustomerId
   * @param {*} option
   * @returns {unknown}
   */
  private async paymentMethodsFormStripe(stripeCustomerId: string, option) {
    const cardList = await this.stripeService.listPaymentMethod(
      {
        customer: stripeCustomerId,
        limit: 100,
        type: 'card',
      },
      option,
    );

    const bankList = await this.stripeService.listPaymentMethod(
      {
        customer: stripeCustomerId,
        limit: 100,
        type: 'au_becs_debit',
      },
      option,
    );

    return [
      ...(cardList.data?.map((card) => ({
        ...card,
        method: {
          paymentMethod: card?.card?.brand || 'Unknown', // Default value to avoid undefined
          ...card?.card, // Optional chaining safely used
        },
      })) || []), // Fallback to an empty array if cardList.data is undefined
      ...(bankList.data?.map((bank) => ({
        ...bank,
        method: {
          ...bank?.au_becs_debit, // Optional chaining to avoid error if undefined
          paymentMethod: bank?.type || 'Unknown', // Default value for payment method
        },
      })) || []), // Fallback to an empty array if bankList.data is undefined
    ];
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {*} user
   * @returns {unknown}
   */
  async getMyPaymentMethods(user) {
    const userDetails = await this.usersRepo.findOne({ _id: user?.userId });
    let paymentMethods = [];

    if (!userDetails?.stripeCustomerId) {
      return {
        message: this.i18nService.t('stripe_payment.no_any_payment_method'),
        paymentMethods: null,
        defaultMethod: null,
      };
    }
    const userPaymentMethods = await this.paymentMethodsFormStripe(
      userDetails.stripeCustomerId,
      null,
    );

    console.log(userPaymentMethods, 'userPaymentMethods==', userDetails);

    paymentMethods = [...userPaymentMethods, ...paymentMethods];

    let defaultMethod = null;
    if (!user.defaultPaymentMethod) {
      const customer = await this.stripeService.retrieveCustomerDetail(
        userDetails.stripeCustomerId,
      );
      defaultMethod = (customer as Stripe.Customer)?.invoice_settings?.default_payment_method;
    } else {
      defaultMethod = userDetails.defaultPaymentMethod;
    }

    return {
      paymentMethods: paymentMethods,
      defaultMethod,
    };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} customerId
   * @param {Stripe.CustomerUpdateParams} data
   * @returns {unknown}
   */
  async updateCustomer(customerId: string, data: Stripe.CustomerUpdateParams) {
    try {
      return await this.stripeService.updateCustomer(customerId, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} customerId
   * @returns {unknown}
   */
  async deleteCustomer(customerId: string) {
    try {
      return await this.stripeService.deleteCustomer(customerId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {CreateCardOnStripe} data
   * @returns {Promise<any>}
   */
  async createCardOnStripe(data: CreateCardOnStripe): Promise<any> {
    try {
      const { customerId, cardToken } = data;
      await this.stripeService.attachPaymentMethod(customerId, cardToken);

      const attached = await this.stripeService.retrievePaymentMethod(cardToken);
      return {
        id: attached?.id,
        name: attached?.billing_details?.name,
        metadata: attached?.metadata,
        ...attached?.card,
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {DeletePaymentMethodFromStripe} data
   * @returns {Promise<any>}
   */
  async deleteCardOnStripe(data: DeletePaymentMethodFromStripe): Promise<any> {
    const { customerId, paymentMethodId } = data;
    try {
      const existingCard = await this.stripeService.retrievePaymentMethod(paymentMethodId);
      if (existingCard?.customer !== customerId) {
        throw new BadRequestException(this.i18nService.t('stripe_payment.cannot_delete_card'));
      }
      return this.stripeService.detachPaymentMethod(paymentMethodId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {*} userId
   * @returns {unknown}
   */
  async getStripeCardsByUser(userId): Promise<PaymentMethodDocument[]> {
    try {
      const card = await this.paymentMethodRepository.find(
        { userId },
        {
          _id: 1,
          userId: 1,
          paymentMethodId: 1,
          paymentMethod: 1,
          country: 1,
          exp_month: 1,
          exp_year: 1,
          fingerprint: 1,
          funding: 1,
          last4: 1,
          name: 1,
          is_default_source: 1,
        },
      );
      return card;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  // Note: uncomment this if want to use stripe
  // /**
  //  * Add new card in stripe and save in database
  //  * @param data
  //  * @returns
  //  */
  // async addCardFromToken(data: CreateCardType) {
  //   const { userId, cardToken } = data;
  //   try {
  //     let customerId = null;
  //     const stripeCustomer = await await this.stripeCustomerRepo.findOne({
  //       userId,
  //     });
  //     if (!stripeCustomer) {
  //       //create customer
  //       const customer = await this.stripeService.createCustomer({
  //         description: `cus-${userId}`,
  //       });
  //       customerId = customer.id;
  //       await this.stripeCustomerRepo.create({ userId, customerId });
  //     } else {
  //       customerId = stripeCustomer.customerId;
  //     }
  //     const createCard = await this.createCardOnStripe({
  //       customerId,
  //       cardToken,
  //     });
  //     const {
  //       id,
  //       brand,
  //       country,
  //       exp_month,
  //       exp_year,
  //       fingerprint,
  //       funding,
  //       last4,
  //       metadata,
  //       name,
  //     } = createCard;
  //     /**
  //      * Check if card is default
  //      */
  //     const userCard = await this.paymentMethodRepository.findOne({ userId });
  //     const isDefaultCard = !userCard;
  //     const existingCard = await this.paymentMethodRepository.findOne({
  //       cardId: cardToken,
  //     });
  //     const createCardData = {
  //       userId,
  //       cardId: id,
  //       brand,
  //       country,
  //       exp_month,
  //       exp_year,
  //       fingerprint,
  //       funding,
  //       last4,
  //       metadata,
  //       name,
  //     };
  //     if (existingCard) {
  //       const updatedCard = await this.paymentMethodRepository.updateById(existingCard?._id, createCardData, {
  //         new: true,
  //       });
  //       return updatedCard;
  //     }
  //     const createdCard = await this.paymentMethodRepository.create({
  //       ...createCardData,
  //       is_default_source: isDefaultCard,
  //     });
  //     return createdCard;
  //   } catch (error: any) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
  /**
   * Delete card from stripe and remove from local
   * @param userId
   * @param auth_token
   */
  async deleteCard(data: DeletePaymentMethod) {
    const { userId, paymentMethodId } = data;
    /**
     * Check if it is default card
     */
    try {
      const getCardDetail = await this.paymentMethodRepository.findOne({ userId, paymentMethodId });
      if (getCardDetail?.is_default_source) {
        //check if other card exist other than default source
        const getOtherCardExceptDefault = await this.paymentMethodRepository.findOne({
          _id: { $ne: getCardDetail._id },
          userId,
        });
        if (getOtherCardExceptDefault) {
          throw new BadRequestException(
            this.i18nService.t('stripe_payment.atlease_one_default_source'),
          );
        }
      }

      const customer = await this.usersRepo.findOne({
        _id: toMongoId(userId),
      });

      if (!customer) {
        this.i18nService.t('stripe_payment.error_making_default_card');
      }

      await this.paymentMethodRepository.updateOne(
        { paymentMethodId },
        { status: 'ready_to_delete' },
      );
      await this.deleteCardOnStripe({
        customerId: customer.stripeCustomerId,
        paymentMethodId,
      });
      await this.paymentMethodRepository.deleteOne({ paymentMethodId, userId });
      return;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * make card default
   */

  async makeCardDefault(userId: string, paymentMethodId: string) {
    try {
      const customer = await this.usersRepo.findOne({
        _id: toMongoId(userId),
      });

      if (!customer) {
        this.i18nService.t('stripe_payment.error_making_default_card');
      }

      await this.stripeService.makeSourceDefaultOnStripe(
        customer?.stripeCustomerId,
        paymentMethodId,
      );
      const makeCardDefault = this.paymentMethodRepository.updateOne(
        { paymentMethodId, userId },
        { is_default_source: true, $unset: { status: 1 } },
      );
      const removeOtherFromDefault = this.paymentMethodRepository.updateMany(
        { paymentMethodId: { $ne: paymentMethodId }, userId },
        { is_default_source: false },
      );
      await Promise.all([makeCardDefault, removeOtherFromDefault]);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  /**
   * @description create a payment from a payment method(eg: card)
   * @param {string} userId user id
   * @param {string} paymentMethodId payment method id: cardID in this case
   */
  async createPayment(userId: string, data: CreatePaymentInput): Promise<MessageResponse> {
    const { amount, paymentMethodId } = data;
    try {
      const stripeCustomer = await this.stripeCustomerRepo.findOne({
        userId,
      });
      if (!stripeCustomer) {
        throw new BadRequestException(this.i18nService.t('stripe_payment.error_stripe_customer'));
      }

      const user = await this.usersService.findById(userId, {
        firstName: 1,
        lastName: 1,
      });
      // pay using payment intent in this case. note: we can use multiple payment approaches
      const paymentIntent = await this.createPaymentIntent({
        amount,
        customer: stripeCustomer?.customerId,
        paymentMethod: paymentMethodId,
        paymentMethodType: ['card', 'au_becs_debit'],
      });

      if (!paymentIntent || paymentIntent?.status === 'canceled')
        throw new BadRequestException(this.i18nService.t('stripe_payment.payment_intent_fail'));

      if (paymentIntent?.status === 'succeeded') {
        await this.stripePaymentRepo.create({
          userId,
          stripeResponse: paymentIntent,
        });

        await this.stripePaymentLogRepo.create({
          userId,
          username: `${user.firstName} ${user.lastName || ''}`,
          amount: paymentIntent.amount || 0,
          currency: paymentIntent.currency || 'aud',
          paymentMethodTypes: paymentIntent.payment_method_types,
          paymentMethodId: paymentIntent.payment_method,
          paymentIntentId: paymentIntent.id,
          paymentStatus: PaymentStatus.COMPLETED,
        });
      }
      return {
        message: this.i18nService.t('stripe_payment.payment_made_successfully'),
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Create a payment intent
   * @param {IPaymentIntentData} intentData payment intent data
   * @return payment intent response object
   */
  private async createPaymentIntent(intentData: IPaymentIntentData) {
    const {
      amount,
      customer,
      currency = defaultCurrency,
      paymentMethod,
      paymentMethodType = ['card'],
      description,
      metadata,
    } = intentData;
    try {
      return await this.stripeService.createPaymentIntent({
        amount: Math.round(amount * 100), //In cent
        customer,
        currency,
        confirm: true, // immediately confirms if true. Note: if false, client_secret will be used instead
        payment_method_types: paymentMethodType,
        payment_method: paymentMethod,
        description,
        metadata,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @description get ephimeral key for processing payment in client side
   * @param {string} userId user id
   * return {string}
   */
  async getEphemeralKey(
    userId: string,
    data: GetEphemeralKeyInput = {
      apiVersion: STRIPE_API_VERSION,
    },
  ): Promise<EphemeralKeyResponse> {
    const { apiVersion } = data;
    try {
      let customerId = null;
      const stripeCustomer = await this.stripeCustomerRepo.findOne({
        userId,
      });

      if (!stripeCustomer) {
        //create customer
        const customer = await this.stripeService.createCustomer({
          description: `cus-${userId}`,
        });
        customerId = customer.id;
        await this.stripeCustomerRepo.create({ userId, customerId });
      } else {
        customerId = stripeCustomer.customerId;
      }

      if (!stripeCustomer) {
        throw new BadRequestException(this.i18nService.t('stripe_payment.error_stripe_customer'));
      }

      const ephemeralKey = await this.stripeService.createEphemeralKey(customerId, apiVersion);

      return {
        message: this.i18nService.t('stripe_payment.ephemeral_key_created'),
        data: {
          keyId: ephemeralKey?.id,
          keySecret: ephemeralKey?.secret,
          createdAt: ephemeralKey?.created,
          expiresAt: ephemeralKey?.expires,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @description get payment history of user
   * @param userId user id
   */
  async getPaymentHistoryOfUser(userId: string, listInput: PaymentHistoryInput) {
    const { skip, limit, order, orderBy } = listInput;
    try {
      const sort = {
        order,
        orderBy,
      };
      const pageMeta = {
        limit,
        skip,
      };
      const filter: any = [
        {
          $match: {
            userId,
          },
        },
      ];
      const { data, pagination } = await this.stripePaymentLogRepo.findAllPaymentsOfUser(
        filter,
        sort,
        pageMeta,
      );
      return {
        message: this.i18nService.t('stripe_payment.payment_history_listed'),
        data: data,
        pagination: pagination,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description gte the detail of stripe payment
   * @param {string} paymentId the id of the payment
   */
  async getPaymentDetail(paymentId: string, userId: string) {
    try {
      const payment = await this.stripePaymentLogRepo.findOne({
        _id: paymentId,
        userId,
      });
      return payment;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description proceed the payment to the stripe business account
   * @param {string} paymentId the id of the payment
   */
  async proceedStripePayout(userId?: string) {
    try {
      const users = await this.getuserInfo(userId);
      for (const user of users) {
        const connectedAccountId = user?.connectedAccountId;

        if (!connectedAccountId) continue;

        const paymentAmount = 1000; // amount after calculation

        const description = `${this.i18nService.t('stripe_payment.amount_payout_to_user')}: ${user.authProviderId}`;

        const paymentData = {
          amount: Math.round(paymentAmount),
          accountId: connectedAccountId,
          stripeCustomerId: user?.stripeCustomerId,
          userId: user?._id,
          description: 'just a payout',
          currency: 'aud',
          status: 'pending',
        };
        // add source transcation if needed according to requirement
        const accountTransfer: any = await this.stripeService.createAccumulatedTransfer(
          Math.round(paymentAmount),
          connectedAccountId,
          'Amount transfer to user',
          'aud',
        );
        if (!accountTransfer || accountTransfer?.exception) {
          throw new BadRequestException(
            accountTransfer?.exception?.message ||
              `${this.i18nService.t('stripe_payment.error_during_transferring')} - ${connectedAccountId}`,
          );
        }

        const userPayout = await this.stripeService.createPayout(
          Math.round(paymentAmount),
          connectedAccountId,
          description,
          'aud',
        );

        if (!userPayout || userPayout?.exception) {
          throw new BadRequestException(
            userPayout?.exception?.message ||
              `${this.i18nService.t('stripe_payment.error_during_transferring')} - ${connectedAccountId}`,
          );
        }

        paymentData.status = userPayout?.status;

        // Note: we can add source transaction id if needed
        // paymentData.sourceTransactionId = userPayout?.id;
        if (userPayout?.status === 'failed' || userPayout?.status === 'canceled') {
          // Note: we can add failure message and code if needed
          // paymentData.failureMessage = userPayout?.failure_message;
          // paymentData.failureCode = userPayout?.failure_code;
        }
        // Note: we can add failure message and code if needed
        // await this.userPaymentInvoiceRepositorty.create(paymentData);

        if (userPayout?.status === 'paid') {
          // update product payment status
        }
      }
      return 'Payout success';
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  private async getuserInfo(userId: string) {
    try {
      if (!userId) {
        return await this.usersService.getUsersWithDuePayout();
      }
      // generally for individual user testing purpose

      const dueInterval = getDynamicDate(new Date(), STRIPE_PAYOUT_INTERVAL, 'before');
      const user = await this.usersRepo.findOne(
        {
          _id: userId,
        },
        {
          _id: 1,
          authProviderId: 1,
        },
      );

      if (user?.lastPayoutAt > dueInterval) {
        throw new BadRequestException(
          this.i18nService.t('stripe_payment.cannot_request_payout_before_one_week_of_last_payout'),
        );
      }

      const stripeCustomer = await this.stripeCustomerRepo.findOne({
        userId,
      });
      if (!stripeCustomer) {
        throw new BadRequestException(this.i18nService.t('stripe_payment.error_stripe_customer'));
      }

      let users = [];

      users.push({
        ...user.toObject(),
        stripeCustomerId: stripeCustomer?._id,
        connectedAccountId: stripeCustomer?.paymentDetail?.accountId,
      });

      return users;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
