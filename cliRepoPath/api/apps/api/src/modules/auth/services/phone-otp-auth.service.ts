import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  PhoneContactType,
  UsersRepository,
  UserTokenMeta,
  OTPRequestRepository,
  UserTokenMetaRepository,
  UpdatePhoneNumberRepository,
} from '@app/data-access';
import { JwtTokenService } from '@app/authentication';
import { RequestPhoneLoginOTPInput } from '../dto/input/request-phone-login-otp.input';
import { PhoneLoginWithOTPInput } from '../dto/input/phone-login-with-otp.input';
import { PartialType } from '../types/partial.type';
import { AwsSNSService } from '@app/otp/sns-otp.service';
import { UpdatePhoneNumberInput } from '../dto/input/update-phone-number.input';
import {
  MAX_OTP_ATTEMPT,
  MULTIPLY_BRFORE_MS,
  SMS_CODE_EXPIRE_BY,
  SMS_CODE_EXPIRE_MULTIPLIER,
} from '@api/constants';
import { UserStatus } from '@app/common/enum/user-status.enum';
import { ConfigVariableService } from '@api/common/helpers/config-helper';
import { I18nService } from 'nestjs-i18n';
import { AgoraHelperService } from '@app/common/services/voip/agora/agora.helper';
import * as crypto from 'crypto';
import { JwtTokenPayload } from '@app/authentication/types/jwt.types';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PhoneOtpAuthService
 * @typedef {PhoneOtpAuthService}
 */
@Injectable()
export class PhoneOtpAuthService {
  /**
   * Creates an instance of PhoneOtpAuthService.
   *
   * @constructor
   * @param {OTPRequestRepository} otpRequestRepository
   * @param {UserTokenMetaRepository} userTokenMetaRepository
   * @param {UsersRepository} userRepository
   * @param {UpdatePhoneNumberRepository} updatePhoneNumberRepository
   * @param {JwtTokenService} jwtTokenService
   * @param {AwsSNSService} awsSNSService
   * @param {AgoraHelperService} agoraHelperService
   */
  constructor(
    private readonly otpRequestRepository: OTPRequestRepository,
    private readonly userTokenMetaRepository: UserTokenMetaRepository,
    private readonly userRepository: UsersRepository,
    private readonly updatePhoneNumberRepository: UpdatePhoneNumberRepository,
    private readonly jwtTokenService: JwtTokenService,
    private readonly awsSNSService: AwsSNSService,
    private readonly agoraHelperService: AgoraHelperService,
    private readonly i18nService: I18nService,
  ) {}
  /**
   * ${1:Description placeholder}
   *
   * @param {boolean} [isDemoCode=true]
   * @returns {number}
   */
  generateSMSCode() {
    if (
      process.env.APP_ENV === 'development' ||
      process.env.APP_ENV === 'local' ||
      process.env.APP_ENV === 'test'
    ) {
      return 123456;
    }

    // return 123456;
    // return Math.floor(1000 + Math.random() * 9000); return 4 digit
    // return 6 digit
    // return Math.floor(100000 + Math.random() * 900000);

    const otp = (crypto.randomBytes(3).readUInt32BE(0) % 900000) + 100000; // 6-digit OTP
    return otp;
  }
  /**
   * Method for sending opt for email login
   * @param data
   * @returns
   */
  async sendPhoneLoginOTP(data: RequestPhoneLoginOTPInput, requestedFor: string) {
    const { dialCode, number, deviceId } = data;
    try {
      const phoneNumber = `${dialCode}${number}`;
      /**
       * find number of attempt in last 24 hrs
       */
      const last24hrs = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
      const currentTime = new Date(new Date().getTime());

      const getAttemptFromThisDevice = await this.otpRequestRepository.find({
        deviceId,
        expiresAt: { $gte: last24hrs },
      });
      /**
       * if attempts are greater than 4 in last 24 hour from same device
       */
      if (getAttemptFromThisDevice.length > parseInt(String(MAX_OTP_ATTEMPT))) {
        //send error too many attempt
        throw new ForbiddenException(this.i18nService.t('auth.too_many_attempts'));
      }
      /**
       * Get attempt from this number
       * */
      const getAttemptFromThisNumber = await this.otpRequestRepository.findOne({
        phoneNumber,
        requestedFor,
      });

      /**
       * has previous attempt from this number
       */
      if (getAttemptFromThisNumber && getAttemptFromThisNumber.expiresAt > currentTime) {
        /**
         * Verification code exists and not expired at
         */

        const { expiresAt } = getAttemptFromThisNumber;
        const expiresBy = new Date(expiresAt).getTime() - new Date().getTime();
        return { expiresAt, expiresBy };
      }
      let verificationCode = 0;
      let expiresAt = null;
      let expiresBy = 0;
      /**
       * If no attempt from this email yet
       */
      if (!getAttemptFromThisNumber) {
        verificationCode = this.generateSMSCode();
        expiresBy = parseInt(String(SMS_CODE_EXPIRE_BY));
        expiresAt = new Date(new Date().getTime() + expiresBy);
        await this.otpRequestRepository.create({
          phoneNumber,
          deviceId,
          expiresBy,
          expiresAt,
          verificationCode,
          requestedFor,
        });
      } else {
        verificationCode = this.generateSMSCode();
        /**
         * If expire by is greater than 2 day reset expire by
         * */
        if (getAttemptFromThisNumber.expiresBy < MULTIPLY_BRFORE_MS) {
          expiresBy =
            getAttemptFromThisNumber.expiresBy * parseInt(String(SMS_CODE_EXPIRE_MULTIPLIER));
        } else {
          expiresBy = parseInt(String(SMS_CODE_EXPIRE_BY));
        }
        expiresAt = new Date(new Date().getTime() + expiresBy);
        await this.otpRequestRepository.updateOne(
          { phoneNumber },
          {
            deviceId,
            expiresBy,
            expiresAt,
            verificationCode,
          },
        );
      }
      const message = `${verificationCode} is your verification code.`;
      await this.awsSNSService.publishMessage(message, phoneNumber);
      /*
       * await this.twilioSendSmsService.sendSms(phoneNumber, verificationCode);
       */
      return { expiresBy, expiresAt };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Method for sending opt for email login
   * @param data
   * @returns
   */
  async sendUpdatePhoneNumberOTP(userId: string, data: UpdatePhoneNumberInput) {
    const { dialCode, number: phoneNumber } = data;
    try {
      /**
       * find number of attempt in last 24 hrs
       */
      const last24hrs = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
      const currentTime = new Date(new Date().getTime());

      const getAttemptFromThisDevice = await this.updatePhoneNumberRepository.find({
        userId,
        expiresAt: { $gte: last24hrs },
      });
      /**
       * if attempts are greater than 4 in last 24 hour from same device
       */
      if (getAttemptFromThisDevice.length > 20) {
        //send error too many attempt
        throw new ForbiddenException(this.i18nService.t('auth.too_many_attempts'));
      }
      /**
       * Get attempt from this number
       * */
      const attemptFromThisNumber = await this.updatePhoneNumberRepository.findOne({
        dialCode,
        phoneNumber,
        userId,
      });

      /**
       * has previous attempt for this
       * resend case
       */
      if (attemptFromThisNumber && attemptFromThisNumber.expiresAt > currentTime) {
        /**
         * Verification code exists and not expired at
         */

        const { expiresAt } = attemptFromThisNumber;
        const expiresBy = new Date(expiresAt).getTime() - new Date().getTime();
        return { expiresAt, expiresBy };
      }
      let expiresAt = null;
      let expiresBy = parseInt(String(SMS_CODE_EXPIRE_BY));
      const verificationCode = this.generateSMSCode();
      /**
       * If no attempt from this email yet
       */
      if (!attemptFromThisNumber) {
        expiresAt = new Date(new Date().getTime() + expiresBy);
        await this.updatePhoneNumberRepository.create({
          userId,
          dialCode,
          phoneNumber,
          phoneType: PhoneContactType.mobile,
          expiresBy,
          expiresAt,
          verificationCode,
        });
      } else {
        /**
         * If expire by is greater than 2 day reset expire by
         * */
        if (attemptFromThisNumber?.expiresBy !== 0 && attemptFromThisNumber.expiresBy < 172800) {
          expiresBy =
            attemptFromThisNumber.expiresBy * parseInt(String(SMS_CODE_EXPIRE_MULTIPLIER));
        }
        expiresAt = new Date(new Date().getTime() + expiresBy);
        await this.updatePhoneNumberRepository.updateOne(
          { phoneNumber, userId },
          {
            dialCode,
            phoneType: PhoneContactType.mobile,
            expiresBy,
            expiresAt,
            verificationCode,
          },
        );
      }
      const message = `${verificationCode} is your verification code.`;
      this.awsSNSService.publishMessage(message, phoneNumber);
      return { expiresBy, expiresAt };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {PhoneLoginWithOTPInput} data
   * @returns {Promise<{ user: any; token: any; }>\}
   */
  async loginWithPhoneOTP(data: PhoneLoginWithOTPInput) {
    const { dialCode, number, verificationCode, deviceId } = data;
    try {
      const phoneNumber = `${dialCode}${number}`;
      const otpVerification = await this.otpRequestRepository.findOne({
        verificationCode,
        phoneNumber,
        deviceId,
      });
      if (!otpVerification) {
        throw new BadRequestException(this.i18nService.t('auth.invalid_verification_code'));
      }
      if (otpVerification.expiresAt < new Date()) {
        throw new BadRequestException(this.i18nService.t('auth.invalid_verification_code'));
      }
      const lastLoggedInAt = new Date();
      const jti = uuidv4();
      /**
       * Update users last logged in at
       */
      const user = await this.userRepository.findOneAndUpdate(
        {
          authProvider: 'phone',
          authProviderId: phoneNumber,
        },
        { lastLoggedInAt, status: UserStatus.email_verified },
        { upsert: true, new: true },
      );
      const payload: JwtTokenPayload = {
        username: phoneNumber,
        sub: user._id.toString(),
        jti,
      };
      const options = ConfigVariableService.jwtTokenConfig();
      const token = this.jwtTokenService.generateTokenPair(payload, options);
      await this.otpRequestRepository.deleteMany({ phoneNumber });
      /**
       * Save user token meta
       * Token has authorization for all api
       */
      const saveTokenMeta: PartialType<UserTokenMeta>[] = [
        {
          userId: user._id.toString(),
          deviceId: otpVerification.deviceId,
          authType: 'phone_otp',
          jti,
          grant: 'all',
          tokenType: 'access_token',
          expiresAt: token.accessTokenExpiresIn,
        },
        {
          userId: user._id.toString(),
          deviceId: otpVerification.deviceId,
          jti,
          tokenType: 'refresh_token',
          expiresAt: token.refreshTokenExpiresIn,
        },
      ];
      await this.userTokenMetaRepository.createMany(saveTokenMeta);

      // Note: Uncomment if commetChat is enabled
      // let cometUser = await this.cometChatService.getCometChatUser(user._id);
      // if (!cometUser) {
      //   cometUser = await this.cometChatService.createCometChatUser({
      //     uid: user._id,
      //     name: user.firstName
      //       ? `${user.firstName} ${user.lastName}`
      //       : user.authProviderId,
      //   });
      // }
      // const cometAuthToken = await this.cometChatService.getCometChatAuthToken({
      //   uid: user._id,
      // });

      if (!user?.agoraUuid) {
        const chatUserUuid = await this.agoraHelperService.getChatUserUuid(
          String(user._id),
          user?.authProviderId,
        );
        if (chatUserUuid) {
          await this.userRepository.updateById(user._id, {
            agoraUuid: chatUserUuid,
          });
        }
      }
      return {
        user: {
          ...user.toObject(),
          // cometAuthToken: cometAuthToken?.authToken,
        },
        token,
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * @description verify update phone number
   * @param {string} userId
   * @param {string} verificationCode
   * @returns
   */
  async verifyUpdatePhone(userId: string, verificationCode: string) {
    try {
      const updatePhoneRequest = await this.updatePhoneNumberRepository.findOne({
        userId,
        verificationCode,
        expiresAt: { $gte: new Date() },
      });
      if (!updatePhoneRequest) {
        throw new BadRequestException(this.i18nService.t('auth.invalid_verification_code'));
      }

      const userDetail = await this.userRepository.findById(userId);
      const userUpdateData = {
        contacts: {
          phone: {
            type: updatePhoneRequest.phoneType,
            dialCode: updatePhoneRequest?.dialCode,
            number: updatePhoneRequest?.phoneNumber,
            isVerified: true,
          },
        },
      };
      if (userDetail?.authProvider === 'phone') {
        userUpdateData['authProviderId'] = updatePhoneRequest.phoneNumber;
      }
      await this.userRepository.updateById(userId, userUpdateData);
      await this.updatePhoneNumberRepository.deleteMany({ userId });
      return;
    } catch (error: any) {
      throw error;
    }
  }
}
