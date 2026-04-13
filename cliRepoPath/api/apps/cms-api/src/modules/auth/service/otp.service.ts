import { ForbiddenException, Injectable } from '@nestjs/common';
import { DeviceInfoRepository, OTPRequestRepository } from '@app/data-access';
import { ForgotPasswordDTO } from '../dto/input/reset-password.dto';
import { SendEmailOTPDTO } from '../dto/input/send-email-otp.dto';
import {
  MAX_ATTEMPTS_FROM_DEVICE,
  MULTIPLY_BRFORE_MS,
  SMS_CODE_EXPIRE_BY,
  SMS_CODE_EXPIRE_MULTIPLIER,
} from './../constants';
import { RequestedFor } from '@app/common/enum/otp-request.enum';
import { SesService } from '@app/email/ses.service';
import * as crypto from 'crypto';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class OtpService
 * @typedef {OtpService}
 */
@Injectable()
export class OtpService {
  /**
   * Creates an instance of OtpService.
   *
   * @constructor
   * @param {OTPRequestRepository} otpRequestRepository
   * @param {SesService} sesService
   * @param {DeviceInfoRepository} deviceInfoRepository
   */
  constructor(
    private readonly otpRequestRepository: OTPRequestRepository,
    private readonly sesService: SesService,
    private readonly deviceInfoRepository: DeviceInfoRepository,
  ) {}
  /**
   * ${1:Description placeholder}
   *
   * @param {boolean} [isDemoCode=true]
   * @returns {number}
   */
  generateOTPCode = (isDemoCode = true) => {
    if (
      process.env.APP_ENV === 'development' ||
      process.env.APP_ENV === 'local' ||
      process.env.APP_ENV === 'test'
    ) {
      return 1234;
    }

    // Note: uncomment if crypto not worked
    // return Math.floor(1000 + Math.random() * 9000);
    const otp = (crypto.randomBytes(3).readUInt32BE(0) % 900000) + 100000; // 6-digit OTP
    return otp;
  };
  /**
   * Method for sending opt for forgot password
   * @param data
   * @returns
   */
  async sendForgotPasswordOTP(data: ForgotPasswordDTO, requestedFor: string) {
    const { email, deviceId } = data;
    const last24hrs = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const currentTime = new Date(new Date().getTime());

    const getAttemptFromThisDevice = await this.otpRequestRepository.find({
      deviceId,
      expiresAt: { $gte: last24hrs },
    });
    /**
     * if attempts are greater than 4 in last 24 hour from same device
     */
    if (getAttemptFromThisDevice.length > 20) {
      //send error too many attempt
      throw new ForbiddenException('You have exceeded the limit');
    }
    /**
     * Get attempt from this email
     * */
    const getAttemptFromThisEmail = await this.otpRequestRepository.findOne({
      email,
      requestedFor,
    });

    /**
     * has previous attempt from this email
     */
    if (getAttemptFromThisEmail && getAttemptFromThisEmail.expiresAt > currentTime) {
      /**
       * Verification code exists and not expired at
       */
      const { expiresAt } = getAttemptFromThisEmail;
      const expiresBy = new Date(expiresAt).getTime() - new Date().getTime();
      return { expiresAt, expiresBy };
    }
    const verificationCode = this.generateOTPCode();
    let expiresAt = null;
    let expiresBy = 0;

    /**
     * If no attempt from this email yet
     */
    if (!getAttemptFromThisEmail) {
      expiresBy = parseInt(String(SMS_CODE_EXPIRE_BY));
      expiresAt = new Date(new Date().getTime() + expiresBy);
      await this.otpRequestRepository.create({
        email,
        deviceId,
        expiresBy,
        expiresAt,
        verificationCode,
        requestedFor,
      });
    } else {
      /**
       * If expire by is greater than 2 day reset expire by
       * */
      if (getAttemptFromThisEmail.expiresBy < 172800) {
        expiresBy =
          getAttemptFromThisEmail.expiresBy * parseInt(String(SMS_CODE_EXPIRE_MULTIPLIER));
      } else {
        expiresBy = parseInt(String(SMS_CODE_EXPIRE_BY));
      }
      expiresAt = new Date(new Date().getTime() + expiresBy);
      await this.otpRequestRepository.updateOne(
        { email },
        {
          deviceId,
          expiresBy,
          expiresAt,
          verificationCode,
          requestedFor,
        },
      );
    }
    return { expiresBy, expiresAt, verificationCode };
  }

  /**
   *
   * @param email
   * @param verificationCode
   * @returns
   */
  async verifyResetPasswordCode(email: string, verificationCode: string): Promise<any> {
    const getCodeRequest = await this.otpRequestRepository.findOne({
      email,
      verificationCode,
      requestedFor: RequestedFor.cms_forgot_password,
      expiresAt: { $gt: new Date() },
    });
    return !!getCodeRequest;
  }
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {SendEmailOTPDTO} data
   * @param {string} requestedFor
   * @returns {Promise<{ expiresAt: any; expiresBy: number; }>\}
   */
  async sendEmailOTP(data: SendEmailOTPDTO, requestedFor: string) {
    const { email, deviceId } = data;
    try {
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
       * if attempts are greater than 20 in last 24 hour from same device
       */
      if (getAttemptFromThisDevice.length > MAX_ATTEMPTS_FROM_DEVICE) {
        //send error too many attempt
        throw new ForbiddenException('You have exceeded the limit');
      }
      /**
       * Get attempt from this email
       * */
      const getAttemptFromThisEmail = await this.otpRequestRepository.findOne({
        email,
        requestedFor,
      });

      const verificationCode = this.generateOTPCode();
      let expiresAt = null;
      let expiresBy = 0;
      /**
       * If no attempt from this email yet
       */
      if (!getAttemptFromThisEmail) {
        expiresBy = parseInt(String(SMS_CODE_EXPIRE_BY));
        expiresAt = new Date(new Date().getTime() + expiresBy);
        await this.otpRequestRepository.create({
          email,
          deviceId,
          expiresBy,
          expiresAt,
          verificationCode,
          requestedFor,
        });
      } else {
        if (getAttemptFromThisEmail?.expiresAt > currentTime) {
          expiresAt = getAttemptFromThisEmail?.expiresAt;
          expiresBy = new Date(expiresAt).getTime() - new Date().getTime();
          return {
            expiresAt,
            expiresBy,
          };
        }
        /**
         * If expire by is greater than 2 day reset expire by
         * */
        expiresBy = parseInt(String(SMS_CODE_EXPIRE_BY));

        if (getAttemptFromThisEmail.expiresBy < MULTIPLY_BRFORE_MS) {
          expiresBy =
            getAttemptFromThisEmail.expiresBy * parseInt(String(SMS_CODE_EXPIRE_MULTIPLIER));
        }
        expiresAt = new Date(new Date().getTime() + expiresBy);
        await this.otpRequestRepository.updateOne(
          { email },
          {
            deviceId,
            expiresBy,
            expiresAt,
            verificationCode,
            requestedFor,
          },
        );
      }
      /**
       * send otp code to email.
       **/
      const message = `Your OTP verification code is ${verificationCode}.`;

      this.sesService.sendEmail({
        email,
        subject: 'Otp code',
        template: message,
      });
      return { expiresBy, expiresAt };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   *
   * @param email
   * @param verificationCode
   * @param deviceId
   * @param userId
   * @returns
   */
  async verify2FAOtpCode(
    email: string,
    verificationCode: string,
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    const getCodeRequest = await this.otpRequestRepository.findOne({
      deviceId,
      email,
      verificationCode,
      requestedFor: RequestedFor.cms_login,
      expiresAt: { $gte: new Date() },
    });
    if (getCodeRequest) {
      await this.deviceInfoRepository.updateOne(
        { userId, deviceId },
        {
          verifiedAt: new Date(),
        },
      );
    }
    return !!getCodeRequest;
  }
}
