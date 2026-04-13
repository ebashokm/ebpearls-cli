import { MessageResponse } from '@app/common/dto/response/message.response';
import { S3Service } from '@app/common/services/s3';
import {
  BusinessDocument,
  BusinessRepository,
  ExternalAccounts,
  UpdatePhoneNumberRepository,
  UserDocument,
  UsersRepository,
} from '@app/data-access';
import { StripeService } from '@app/stripe';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import Stripe from 'stripe';
import { BusinessType } from '../stripe-payment/enum/payment-status.enum';
import { PORTAL_URI } from './constant/stripe-connect';
import {
  CreateBankAccountInput,
  CreateBankAccountLinkInput,
  CreateOnboardingAccountLinkInput,
} from './dto/input/create-bank-detail.input';
import { CreateBankDetailInput, CreateBankTokenInput } from './dto/input/create-bank.input';
import { LinkBankAccountType } from './enum/link-connect-account.enum';

/**
 * Description placeholder
 *
 * @export
 * @class StripeConnectService
 * @typedef {StripeConnectService}
 */
@Injectable()
export class StripeConnectService {
  /**
   * Creates an instance of StripeConnectService.
   *
   * @constructor
   * @param {StripeService} stripeService
   * @param {BusinessRepository} businessRepo
   * @param {I18nService} i18nService
   * @param {UsersRepository} usersRepository
   * @param {S3Service} s3Service
   * @param {UpdatePhoneNumberRepository} phoneNumberRepo
   */
  constructor(
    private readonly stripeService: StripeService,
    private readonly businessRepo: BusinessRepository,
    private readonly i18nService: I18nService,
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service,
    private readonly phoneNumberRepo: UpdatePhoneNumberRepository,
  ) {}

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @param {CreateBankAccountInput} body
   * @returns {unknown}
   */
  async addUserBankAccountFromToken(
    userId: string,
    body: CreateBankAccountInput,
  ): Promise<Stripe.Response<Stripe.ExternalAccount>> {
    try {
      const { business, user } = await this.getBusiness(userId);

      if (!business?.bankDetail?.accountId) {
        throw new BadRequestException(this.i18nService.t('Stripe connect not found'));
      }

      const account = await this.stripeService.createExternalAccount(
        business?.bankDetail?.accountId,
        body.bankToken,
      );

      const externalAccount: ExternalAccounts = {
        id: account.id,
        object: account.object,
        account: typeof account.account === 'string' ? account.account : account.account.id,
        account_holder_name: 'account_holder_name' in account ? account.account_holder_name : null,
        account_holder_type: 'account_holder_type' in account ? account.account_holder_type : null,
        bank_name: 'bank_name' in account ? account.bank_name : null,
        country: account.country,
        currency: account.currency,
        last4: account.last4,
        routing_number: 'routing_number' in account ? account.routing_number : null,
        status: account.status,
        default_for_currency: account.default_for_currency,
      };

      await this.businessRepo.updateOne(
        { _id: user.businessId },
        { $push: { 'bankDetail.externalAccounts': externalAccount } },
      );

      return account;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @param {CreateBankTokenInput} body
   * @returns {Promise<Stripe.Response<Stripe.ExternalAccount>>}
   */
  async addUserBankAccountFromDetail(
    userId: string,
    body: CreateBankTokenInput,
  ): Promise<Stripe.Response<Stripe.ExternalAccount>> {
    try {
      const { accountName, accountNumber, routingNumber, accountHolderType, accountType } = body;

      const { business, user } = await this.getBusiness(userId);

      if (!business?.bankDetail?.accountId) {
        throw new BadRequestException(this.i18nService.t('Stripe connect not found'));
      }

      const bankToken = await this.stripeService.createBankToken({
        accountName,
        accountNumber,
        routingNumber,
        accountHolderType,
        accountType,
      });

      const res = await this.stripeService.createExternalAccount(
        business?.bankDetail?.accountId,
        bankToken.id,
      );

      const externalAccount: Partial<ExternalAccounts> = {
        id: res.id,
        object: res.object, // Corrected to match the original key
        account: res.account.toString(),
        country: res.country,
        currency: res.currency,
        last4: res.last4, // Removed the incorrect quote
        status: res.status,
      };

      await this.businessRepo.updateOne(
        { _id: user.businessId },
        { $push: { 'bankDetail.externalAccounts': externalAccount } },
      );

      return res;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @param {string} bankId
   * @returns {unknown}
   */
  async updateDefaultBankAccount(userId: string, bankId: string): Promise<boolean> {
    try {
      const { business, user } = await this.getBusiness(userId);

      if (!business?.bankDetail?.accountId) {
        throw new BadRequestException(this.i18nService.t('Account not found'));
      }

      await this.stripeService.updateExternalAccount(business?.bankDetail?.accountId, bankId);

      await this.businessRepo.updateOne(
        { _id: user.businessId },
        { $set: { 'bankDetail.externalAccounts.$[].default_for_currency': false } },
      );

      await this.businessRepo.updateOne(
        { _id: user.businessId, 'bankDetail.externalAccounts.id': bankId },
        { $set: { 'bankDetail.externalAccounts.$.default_for_currency': true } },
      );

      return true;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @param {string} bankId
   * @returns {unknown}
   */
  async deleteUserBankAccount(userId: string, bankId: string): Promise<boolean> {
    try {
      const { business, user } = await this.getBusiness(userId);

      if (!business?.bankDetail?.accountId) {
        throw new BadRequestException(this.i18nService.t('Account not found'));
      }

      const existingPayment = business?.bankDetail?.externalAccounts?.find(
        (payment) => payment.id == bankId,
      );

      if (!business?.bankDetail?.accountId || !existingPayment) {
        throw new NotFoundException(this.i18nService.t('stripe_connect.bank_account_not_found'));
      }

      await this.stripeService.deleteUserBankAccount(business?.bankDetail?.accountId, bankId);

      await this.businessRepo.updateOne(
        { _id: user.businessId },
        { $pull: { 'bankDetail.externalAccounts': { id: bankId } } },
      );

      return true;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @param {string} connectAccountId
   * @returns {unknown}
   */
  async deleteStripeConnectAccount(userId: string, connectAccountId: string): Promise<boolean> {
    try {
      const { business } = await this.getBusiness(userId);

      if (business?.bankDetail?.accountId !== connectAccountId) {
        throw new NotFoundException(this.i18nService.t('stripe_connect.account_not_found'));
      }
      await this.stripeService.deleteConnectedAccount(connectAccountId);
      business.bankDetail = null;
      await business.save();
      return true;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @returns {unknown}
   */
  async generateCustomAccountOnboardingLink(
    userId: string,
    body: CreateBankAccountLinkInput,
  ): Promise<Stripe.Response<Stripe.Account>> {
    try {
      await this.getBusiness(userId);
      const res = await this.stripeService.createConnectedAccount({
        type: 'custom',
        business_type: body.accountHolderType,
        country: 'AU',
        capabilities: {
          card_payments: {
            requested: true,
          },
          transfers: {
            requested: true,
          },
        },
      });
      return res;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @private
   * @async
   * @param {string} userId
   * @returns {Promise<{ user: any; business: any }>}
   */
  private async getBusiness(
    userId: string,
  ): Promise<{ user: UserDocument; business: BusinessDocument }> {
    const user = await this.usersRepository.findOne({ _id: userId });
    if (!user?.businessId) {
      throw new BadRequestException(this.i18nService.t('stripe_connect.business_user_fetch_error'));
    }

    const business = await this.businessRepo.findOne({ _id: user.businessId });
    if (!business) {
      throw new BadRequestException(this.i18nService.t('stripe_connect.business_user_fetch_error'));
    }

    return { user, business };
  }
  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @param {CreateBankAccountLinkInput} body
   * @returns {unknown}
   */
  async generateAccountOnboardingLink(
    userId: string,
    body: CreateBankAccountLinkInput,
  ): Promise<Stripe.Response<Stripe.AccountLink>> {
    const { bankAccountType, connectAccountId } = body;
    try {
      const { business, user } = await this.getBusiness(userId);

      if (!user?.stripeCustomerId) {
        const customer = await this.stripeService.createCustomer({
          description: `cus-${userId}`,
        });
        user.stripeCustomerId = customer.id;
        await user.save();
      }

      if (business?.bankDetail?.accountStatus === 'completed') {
        throw new BadRequestException(
          this.i18nService.t('stripe_connect.account_already_connected'),
        );
      }

      let connectedAccountId = connectAccountId;

      if (
        bankAccountType === LinkBankAccountType.STANDARD ||
        bankAccountType === LinkBankAccountType.EXPRESS
      ) {
        let connectAccountPayload: Stripe.AccountCreateParams = {
          type: bankAccountType,
          email: business.email,
        }; // for standard account

        if (bankAccountType === LinkBankAccountType.EXPRESS) {
          connectAccountPayload = {
            ...connectAccountPayload,
            country: 'AU',
            type: body.bankAccountType,
            capabilities: {
              card_payments: {
                requested: true,
              },
              transfers: {
                requested: true,
              },
            },
          };
        }

        const connectedAccount =
          await this.stripeService.createConnectedAccount(connectAccountPayload);

        connectedAccountId = connectedAccount.id;
      }

      business.bankDetail = {
        accountType: bankAccountType,
        accountId: connectedAccountId,
        accountStatus: 'not_created',
        verificationStatus: 'pending',
        businessType: BusinessType.company,
      };

      const accountLink = await this.stripeService.createAccountLinks({
        account: connectedAccountId,
        refresh_url: `${PORTAL_URI}/profile-setting`,
        return_url: `${PORTAL_URI}/profile-setting`,
        type: 'account_onboarding',
        ...(bankAccountType === LinkBankAccountType.CUSTOM && {
          collection_options: {
            fields: 'eventually_due', // currently_due
          },
        }),
      });

      return accountLink;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description create the connected account from bank details
   * @param {CreateBankDetailInput} data data to create the connected account from
   * @param {string} userId user id
   * @returns {Promise<MessageResponse>}
   */
  async createCustomStripeAccount(
    data: CreateBankDetailInput,
    userId: string,
  ): Promise<MessageResponse> {
    const {
      accountName,
      accountNumber,
      routingNumber,
      accountHolderType,
      accountType,
      identityDocumentFront,
      identityDocumentBack,
    } = data;
    try {
      const { business, user } = await this.getBusiness(userId);

      if (!user?.stripeCustomerId) {
        const customer = await this.stripeService.createCustomer({
          description: `cus-${userId}`,
        });
        user.stripeCustomerId = customer.id;
        await user.save();
      }

      if (business?.bankDetail?.accountId) {
        throw new BadRequestException(this.i18nService.t('stripe_connect.bank_already_connected'));
      }

      // create external account from bank details input
      const bankToken = await this.stripeService.createBankToken({
        accountName,
        accountNumber,
        routingNumber,
        accountHolderType,
        accountType,
      });

      let frontDocId, backDocId;
      if (identityDocumentFront && identityDocumentBack) {
        const FrontUrl = await this.s3Service.getSignedUrl(identityDocumentFront);
        const BackUrl = await this.s3Service.getSignedUrl(identityDocumentBack);

        const uploadFront = await this.stripeService.uploadIdentityFile(
          identityDocumentFront,
          FrontUrl,
        );
        const uploadBack = await this.stripeService.uploadIdentityFile(
          identityDocumentBack,
          BackUrl,
        );

        frontDocId = uploadFront.id;
        backDocId = uploadBack.id;
      }

      const userPhoneNumber = await this.phoneNumberRepo.findOne(
        {
          userId: user._id,
        },
        {
          dialCode: 1,
          phoneNumner: 1,
        },
      );

      const connectedAccountResult = await this.stripeService.createConnectedAccount({
        type: 'custom',
        country: 'AU',
        email: user?.authProviderId,
        capabilities: {
          card_payments: {
            requested: true,
          },
          transfers: {
            requested: true,
          },
        },
        default_currency: 'AUD',
        external_account: bankToken.id,
        business_type: accountHolderType,
        individual: {
          address: {
            line1:
              user?.address?.location?.street ||
              user?.address?.displayAddress ||
              'address_full_match',
            city: user?.address?.location?.city || 'new south wales',
            country: 'AU',
            postal_code: user?.address?.location?.postalCode || '1215',
            state: user?.address?.location?.state || 'NSW',
          },
          dob: {
            day: 1,
            month: 1,
            year: 1901,
          },
          first_name: user?.firstName || 'firstname',
          last_name: user?.lastName || 'lastname',
          phone: userPhoneNumber
            ? `+${userPhoneNumber?.dialCode}${userPhoneNumber?.phoneNumber}`
            : '000 000 0000', // test phone number
          email: user?.authProviderId,
          ...(frontDocId &&
            backDocId && {
              verification: {
                document: {
                  front: frontDocId,
                  back: backDocId,
                },
                additional_document: {
                  front: frontDocId,
                  back: backDocId,
                },
              },
            }),
        },
        business_profile: {
          mcc: '8299', // change mcc to client's
          url: 'https://dev.evtheme/', // change business profile url
        },

        tos_acceptance: {
          date: Math.floor(Date.now() / 1000),
          ip: '202.166.198.75', // Assumes you're not using a proxy (use ip)
        },
      });

      const externalAccounts: ExternalAccounts[] =
        connectedAccountResult.external_accounts.data.map((payment) => ({
          id: payment.id,
          object: payment.object, // Corrected to match the original key
          account: payment.account.toString(),
          account_holder_name:
            'account_holder_name' in payment ? payment.account_holder_name : null,
          account_holder_type:
            'account_holder_type' in payment ? payment.account_holder_type : null,
          bank_name: 'bank_name' in payment ? payment.bank_name : null,
          default_for_currency: payment.default_for_currency,
          country: payment.country,
          currency: payment.currency,
          last4: payment.last4, // Removed the incorrect quote
          routing_number: 'routing_number' in payment ? payment.routing_number : null,
          status: payment.status,
        }));

      business.bankDetail = {
        accountId: connectedAccountResult.id,
        externalAccounts: externalAccounts,
        accountType: 'custom',
        accountStatus: 'pending',
        verificationStatus: 'pending',
        businessType: BusinessType.individual,
      };
      await business.save();

      return {
        message: this.i18nService.t('stripe_payment.bank_detail_added_successfully'),
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @returns {unknown}
   */
  async getUserStripeAccountDetails(userId: string) {
    try {
      const { business, user } = await this.getBusiness(userId);

      if (!user?.stripeCustomerId) {
        const customer = await this.stripeService.createCustomer({
          description: `cus-${userId}`,
        });
        user.stripeCustomerId = customer.id;
        await user.save();
      }

      if (!business) {
        throw new BadRequestException(
          this.i18nService.t('stripe_connect.business_user_fetch_error'),
        );
      }

      return business.bankDetail;
    } catch (error: any) {
      throw error;
    }
  }

  async createOnboardingAccountLink(userId: string, body: CreateOnboardingAccountLinkInput) {
    const { businessType } = body;
    // get already create account id.
    const { business } = await this.getBusiness(userId);

    if (!business) {
      // if not a business account throw error.
      throw new BadRequestException(this.i18nService.t('stripe_connect.business_user_fetch_error'));
    }

    let accountId: string;

    if (business.bankDetail) {
      // if there is connect account already created,
      // check if the business type is matching
      if (business.bankDetail.businessType !== businessType)
        throw new BadRequestException(
          this.i18nService.t('stripe_connect.business_type_does_not_match'),
        );

      // else continue if it matches
      accountId = business.bankDetail.accountId;
    } else {
      // create a connected account
      const connectAccount = await this.stripeService.createConnectedAccount({
        type: 'custom',
        email: business.email,
        country: 'AU',
        business_type: businessType,
        capabilities: {
          card_payments: {
            requested: true,
          },
          transfers: {
            requested: true,
          },
        },
      });

      // also update bank details
      business.bankDetail = {
        accountType: connectAccount.type,
        accountId: connectAccount.id,
        // i think it is not_created and pending since we need to complete the
        // onboarding from stripe hosted UI.
        accountStatus: 'not_created',
        verificationStatus: 'pending',
        businessType: businessType,
      };
      await business.save();
      accountId = connectAccount.id;
    }

    // then create account link
    const accountLink = await this.stripeService.createAccountLinks({
      account: accountId,
      type: 'account_onboarding',
      collection_options: {
        fields: 'eventually_due',
      },
      return_url: `${process.env.BASE_URL}/stripe-redirect/return-url`,
      refresh_url: `${process.env.BASE_URL}/stripe-redirect/refresh-url`,
    });

    return {
      url: accountLink.url,
      expiresAt: accountLink.expires_at,
      created: accountLink.created,
    };
  }
}
