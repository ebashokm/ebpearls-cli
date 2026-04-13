import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService as Jwt } from '@nestjs/jwt';
import { AdminLoginResponse, RefreshTokenResponse } from '../dto/response/auth-response';
import { CreateAdminDTO } from '../dto/input/create-admin.dto';
import { JwtService } from './jwt.service';
import {
  AdminRepository,
  AdminDocument,
  DeviceInfoRepository,
  OTPRequestRepository,
  LoginInfoRepository,
  Admin,
  DeviceInfo,
  RoleRepository,
} from '@app/data-access';
import { TokenService } from '../../admin/service/token.service';
import { HashService } from './hash.service';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDTO } from '../dto/input/change-password.dto';
import { TokenExpiredError } from 'jsonwebtoken';
import {
  ForgotPasswordDTO,
  ResetPasswordOtpVerificationDTO,
} from '../dto/input/reset-password.dto';
import { OtpService } from './otp.service';
import { ResetPWOtpVerificationResponse } from '../dto/response/reset-password.dto';

import { OtpVerificationFor2FADTO, Resend2FAOtpCodeDTO } from '../dto/input/2fa-otp.dto';
import {
  AuthUrlResponse,
  ResendOtpCodeResponse,
  VerifyAuthOtpResponse,
} from '../dto/response/2fa-response';
import { SettingService } from '../../settings/settings.service';
import * as OTPAuth from 'otpauth';
import { encode } from 'hi-base32';
import { ForgotPasswordResponse } from '../dto/response/forgort-password-response';
import { EmailService } from '@app/email/email.service';
import { I18nService } from 'nestjs-i18n';
import { RequestedFor } from '@app/common/enum/otp-request.enum';
import { AdminStatus } from '@app/data-access/admin/admin-status.enum';
import { AdminUserRecord } from '../types/auth.types';
import { SignedUrlMethod } from '@app/common/enum/signed-url.enum';
import { S3Service } from '@app/common/services/s3';
import { toMongoId } from '@app/common/helpers/mongo-helper';
import { RoleSlugs } from '@app/data-access/roles/role-slugs';
import { Transactional } from '@nestjs-cls/transactional';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AuthService
 * @typedef {AuthService}
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService.
   *
   * @constructor
   * @param {AdminRepository} adminRepository
   * @param {JwtService} jwtService
   * @param {TokenService} tokenService
   * @param {EmailService} emailService
   * @param {HashService} hashService
   * @param {ConfigService} configService
   * @param {Jwt} jwt
   * @param {OtpService} otpService
   * @param {DeviceInfoRepository} deviceInfoRepository
   * @param {OTPRequestRepository} otpRequestRepository
   * @param {BusinessRepository} businessUserRepository
   * @param {SettingService} settingService
   */
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly hashService: HashService,
    private readonly configService: ConfigService,
    private readonly jwt: Jwt,
    private readonly otpService: OtpService,
    private readonly deviceInfoRepository: DeviceInfoRepository,
    private readonly otpRequestRepository: OTPRequestRepository,
    private readonly settingService: SettingService,
    private readonly i18nService: I18nService,
    private readonly loginInfoRepository: LoginInfoRepository,
    private readonly s3Service: S3Service,
    private readonly roleRepository: RoleRepository,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} email
   * @param {string} password
   * @returns {Promise<any>}
   */
  async validateAdminStatus(userId: string) {
    let user = await this.adminRepository.findOne({ _id: userId });
    if (user?.status !== AdminStatus.ACTIVE) {
      throw new ForbiddenException(
        this.i18nService.t('common.inactive', { args: { entity: 'Admin' } }),
      );
    }
    return user;
  }

  private isTenMinutesLater(updatedAt: Date) {
    const currentTime = new Date();
    const tenMinutesLater = new Date(updatedAt.getTime() + 5 * 60 * 1000); // Add 10 minutes
    return currentTime >= tenMinutesLater;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} email
   * @param {string} password
   * @returns {Promise<any>}
   */
  async validate(
    email: string,
    password: string,
    deviceId: string = null,
    ip: string = null,
    agent: string = null,
  ) {
    let user = await this.adminRepository.findOne({ email });

    if (!user) {
      throw new BadRequestException(this.i18nService.t('auth.invalid_credentials'));
    }

    if (!user?.password) {
      await this.adminRepository.updateById(user._id, {
        invalidLoginCount: (user?.invalidLoginCount || 0) + 1,
      });

      await this.loginInfoRepository.create({
        userId: user?._id,
        userModel: 'Admin',
        email,
        deviceId: deviceId,
        agent,
        ip,
        loginTime: new Date(),
        failureReason: this.i18nService.t('auth.user_not_found'),
        isSuccessful: false,
      });
      throw new BadRequestException(this.i18nService.t('auth.invalid_credentials'));
    }

    // Note: Block user if multiple invalid login
    // if (user.invalidLoginCount >= 5 && !this.isTenMinutesLater(user.updatedAt)) {
    //   throw new BadRequestException(
    //     this.i18nService.t('auth.user_block_due_to_multiple_invalid_login'),
    //   );
    // }

    const isValidPass = await this.hashService.comparePassword(password, user.password);
    if (!isValidPass) {
      await this.adminRepository.updateById(user._id, {
        invalidLoginCount: (user?.invalidLoginCount || 0) + 1,
      });

      await this.loginInfoRepository.create({
        userId: user?._id,
        userModel: 'Admin',
        email,
        deviceId: deviceId,
        agent,
        ip,
        loginTime: new Date(),
        failureReason: this.i18nService.t('auth.unauthorized_user'),
        isSuccessful: false,
      });
      throw new BadRequestException(this.i18nService.t('auth.invalid_credentials'));
    }
    if (user?.status !== AdminStatus.ACTIVE) {
      await this.adminRepository.updateById(user._id, {
        invalidLoginCount: (user?.invalidLoginCount || 0) + 1,
      });

      await this.loginInfoRepository.create({
        userId: user?._id,
        userModel: 'Admin',
        email,
        deviceId: deviceId,
        agent,
        ip,
        loginTime: new Date(),
        failureReason: this.i18nService.t('common.inactive', { args: { entity: 'Admin' } }),
        isSuccessful: false,
      });

      throw new ForbiddenException(
        this.i18nService.t('common.inactive', { args: { entity: 'Admin' } }),
      );
    }

    await this.adminRepository.findOneAndUpdate(
      {
        _id: user._id,
      },
      { invalidLoginCount: 0 },
    );

    return user;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} admin
   * @param {string} browserDetail
   * @returns {Promise<AdminLoginResponse>}
   */

  async login(admin: Admin, browserDetail: string): Promise<AdminLoginResponse> {
    try {
      const payload = {
        id: admin._id,
      };
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAccessToken(payload),
        this.jwtService.signRefreshToken(payload),
      ]);

      if (!(await this.isTwoFactorAuthEnabled(admin))) {
        return { admin, accessToken, refreshToken };
      }

      const existingDevice = await this.deviceInfoRepository.findOne({
        userId: admin._id,
        deviceId: browserDetail,
      });

      if (existingDevice && !this.isTwoFactorAuthExpired(existingDevice.verifiedAt)) {
        return { admin, accessToken, refreshToken };
      }

      await this.updateOrCreateDeviceRecord(admin._id, browserDetail, existingDevice);

      const response = await this.otpService.sendEmailOTP(
        { email: admin.email, deviceId: browserDetail },
        RequestedFor.cms_login,
      );

      return { admin, expiresAt: response.expiresAt, expiresBy: response.expiresBy };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Checks if two-factor authentication (2FA) is enabled.
   */
  private async isTwoFactorAuthEnabled(admin: Admin): Promise<boolean> {
    const is2FAEnabled = await this.settingService.getSettingBySlug('enable-2fa');
    if (is2FAEnabled.value !== 'true') return false;

    return !(
      this.configService.get('2FA_METHOD') === 'authenticator-based-otp' && admin.enabled2FA
    );
  }

  /**
   * Checks if the 2FA verification has expired.
   */
  private isTwoFactorAuthExpired(verifiedAt: Date): boolean {
    if (!verifiedAt) return true;

    const expirationTimeInMinutes = 10; // Change this for production expiration logic
    const expiredDate = new Date(verifiedAt);
    expiredDate.setMinutes(expiredDate.getMinutes() + expirationTimeInMinutes);

    return new Date() > expiredDate;
  }

  /**
   * Updates or creates a device verification record.
   */
  private async updateOrCreateDeviceRecord(
    userId: string,
    deviceId: string,
    existingDevice: DeviceInfo,
  ) {
    if (existingDevice) {
      await this.deviceInfoRepository.updateOne({ userId, deviceId }, { verifiedAt: null });
    } else {
      await this.deviceInfoRepository.create({
        userId,
        deviceId,
        deviceType: 'web',
        deviceName: 'browser',
      });
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} user
   * @returns {Promise<{ user: any; accessToken: any; refreshToken: any; }>\}
   */
  async loginBusinessUser(user): Promise<{
    user: any;
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = { id: user._id, email: user.email };
    const accessToken = await this.jwtService.signAccessToken(payload);
    const refreshToken = await this.jwtService.signRefreshToken(payload);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateAdminDTO} input
   * @returns {Promise<AdminDocument>}
   */
  @Transactional()
  async createAdmin(input: CreateAdminDTO): Promise<AdminDocument> {
    const { firstName, lastName, email, roles, phone } = input;
    const randomPass = crypto.randomBytes(32).toString('hex');
    try {
      const existingAdmin = await this.adminRepository.getAdminByEmail(email);
      if (existingAdmin) {
        const messageKey = existingAdmin.isDeleted
          ? 'common.email_exists_but_deleted'
          : 'common.already_exists';

        throw new BadRequestException(
          this.i18nService.t(messageKey, { args: { entity: 'Email' } }),
        );
      }

      const phoneExists = await this.adminRepository.findOne({ phone });
      if (phoneExists)
        throw new BadRequestException(
          this.i18nService.t('common.already_exists', { args: { entity: 'Phone' } }),
        );

      const admin = await this.adminRepository.create({
        firstName,
        lastName,
        email,
        password: await this.hashService.hashPassword(randomPass),
        roles: roles.map((r) => toMongoId(r)),
        status: AdminStatus.PENDING,
        phone,
      });

      const token = await this.tokenService.generateToken(admin._id);

      /* build the reset link */
      const link = `${this.configService.get('CMS_PORTAL_URI')}/reset-password?userId=${
        admin._id
      }&token=${token.token}`;

      const values = {
        link,
        name: `${firstName} ${lastName}`,
      };

      this.emailService.sendEmail({
        to: email,
        values,
        slug: RequestedFor.verify_email_set_password,
      });

      return admin;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {ForgotPasswordDTO} input
   * @returns {Promise<ForgotPasswordResponse>}
   */
  @Transactional()
  async forgotPassword(input: ForgotPasswordDTO): Promise<ForgotPasswordResponse> {
    const { email, deviceId } = input;
    try {
      const user = await this.adminRepository.findOne({ email });

      if (!user) {
        throw new BadRequestException(
          this.i18nService.t('common.not_exist', { args: { entity: 'Email' } }),
        );
      }

      if (user.status !== AdminStatus.ACTIVE) {
        throw new BadRequestException(this.i18nService.t('auth.not_verified'));
      }
      let token = await this.tokenService.getToken(user._id);
      if (!token) {
        token = await this.tokenService.generateToken(user._id);
      }

      if (deviceId) {
        await this.otpService.sendForgotPasswordOTP(input, 'forgot-password');
      } else {
        /* build the reset link */

        const link = `${this.configService.get('CMS_PORTAL_URI')}/reset-password?userId=${
          user._id
        }&token=${token.token}`;

        const values = {
          link,
          name: user.firstName + '' + user.lastName,
        };

        this.emailService.sendEmail({
          to: email,
          values,
          slug: RequestedFor.forgot_password,
        });
      }
      return { message: this.i18nService.t('auth.password_reset_mail_send') };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {ResetPasswordOtpVerificationDTO} input
   * @returns {Promise<ResetPWOtpVerificationResponse>}
   */
  @Transactional()
  async resetPasswordOtpVerification(
    input: ResetPasswordOtpVerificationDTO,
  ): Promise<ResetPWOtpVerificationResponse> {
    const { email, otp } = input;
    try {
      const user = await this.adminRepository.findOne({ email });
      if (!user) {
        throw new NotFoundException(
          this.i18nService.t('common.not_exist', { args: { entity: 'Email' } }),
        );
      }
      const otpVerified: boolean = await this.otpService.verifyResetPasswordCode(email, otp);

      if (!otpVerified) {
        throw new BadRequestException(this.i18nService.t('auth.invalid_otp'));
      }
      let token = await this.tokenService.getToken(user._id);
      if (!token) {
        token = await this.tokenService.generateToken(user._id);
      }
      /* build the reset link */
      const link = `/reset-password?userId=${user._id}&token=${token.token}`;
      return {
        userId: user._id,
        token: link,
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} userId
   * @param {string} token
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  @Transactional()
  async resetPassword(userId: string, token: string, password: string): Promise<boolean> {
    const validToken = await this.tokenService.validate(userId, token);
    if (!validToken) {
      throw new UnauthorizedException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Email' } }),
      );
    }
    const hash = await bcrypt.hash(password, Number(10));

    /* update user password & delete token */
    await this.adminRepository.updateById(userId, {
      password: hash,
      status: AdminStatus.ACTIVE,
    });

    await this.tokenService.removeToken(token);

    return true;
  }

  /**
   * @description change admin password
   * @param {ChangePasswordDTO} input change password data
   * @param {string} userId user id
   * @returns {Boolean} true if successful
   */
  @Transactional()
  async changePassword(input: ChangePasswordDTO, userId: string) {
    const { password, oldPassword } = input;
    try {
      const user = await this.adminRepository.findById(userId);
      if (!user) {
        throw new NotFoundException(
          this.i18nService.t('common.not_exist', { args: { entity: 'User' } }),
        );
      }

      /* validate password */
      const isValidPass = await this.hashService.comparePassword(oldPassword, user.password);

      if (!isValidPass) {
        throw new BadRequestException(this.i18nService.t('auth.password_invalid'));
      }

      /* update user password*/
      const hash = await this.hashService.hashPassword(password);
      await this.adminRepository.updateById(userId, {
        password: hash,
      });

      return true;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  async getProfile(userId: string) {
    try {
      const userProfile: AdminUserRecord = await this.adminRepository.getAdminById(userId);
      if (userProfile?.profileImage) {
        const objectKey = `public/cms-profiles/${userProfile.profileImage}`;
        const contentType = 'image/*';
        userProfile.profileImageUrl = await this.s3Service.getPreSignedUrl(
          objectKey,
          SignedUrlMethod.GET,
          contentType,
        );
      }

      userProfile.isSuperAdmin = userProfile.roleDetails?.some(
        (r) => r.slug === RoleSlugs.SUPER_ADMIN,
      );
      userProfile.permissions = await this.roleRepository.getRolesPermissions(userProfile.roles);
      return userProfile;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description generates new refresh token from old refresh token
   * @param refreshToken old refresh token
   */
  async refresh(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      if (!refreshToken) {
        throw new BadRequestException(this.i18nService.t('auth.refresh_token_required'));
      }
      const decoded = await this.decodeRefreshToken(refreshToken);
      if (!decoded?.id) {
        throw new UnauthorizedException(this.i18nService.t('auth.unauthorized_user'));
      }

      // Remove access token and refresh token
      const admin = await this.adminRepository.findOne({
        _id: decoded.id,
      });
      if (!admin) {
        throw new ForbiddenException(this.i18nService.t('auth.unauthorized_user'));
      }

      const refreshTokenPayload = {
        id: admin._id,
      };
      const accessToken = await this.jwtService.signAccessToken(refreshTokenPayload);
      const newRefreshToken = await this.jwtService.signRefreshToken(refreshTokenPayload);

      return {
        message: this.i18nService.t('auth.refresh_token_generation_success'),
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @private
   * @async
   * @param {string} token
   * @returns {Promise<any>}
   */
  private async decodeRefreshToken(token: string): Promise<any> {
    try {
      return await this.jwt.verifyAsync(token, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException(this.i18nService.t('auth.refresh_token_expired'));
      } else {
        throw new UnauthorizedException(this.i18nService.t('auth.refresh_token_malformed'));
      }
    }
  }
  /**
   * @description Verify otp code
   * @param {OtpVerificationFor2FADTO} input deviceId and otp
   * @returns {AdminLoginResponse}
   */
  async otpVerificationFor2FA(input: OtpVerificationFor2FADTO): Promise<AdminLoginResponse> {
    const { email, otp, deviceId } = input;
    try {
      const user = await this.adminRepository.findOne({ email });
      if (!user) {
        throw new NotFoundException(
          this.i18nService.t('common.not_exist', { args: { entity: 'User' } }),
        );
      }
      const otpVerified: boolean = await this.otpService.verify2FAOtpCode(
        email,
        otp,
        deviceId,
        user._id,
      );

      if (!otpVerified) {
        throw new BadRequestException(this.i18nService.t('auth.invalid_otp'));
      }
      await this.otpRequestRepository.deleteMany({
        email,
        deviceId,
      });
      const payload = { id: user._id };
      const accessToken = await this.jwtService.signAccessToken(payload);
      const refreshToken = await this.jwtService.signRefreshToken(payload);

      return {
        admin: user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error.response.message === this.i18nService.t('auth.invalid_otp')) {
        throw new HttpException(
          this.i18nService.t('auth.invalid_otp'),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  /**
   * @description resend otp for 2FA
   * @param {Resend2FAOtpCodeDTO} input device details
   * @returns {ResendOtpCodeResponse} expireAt and expiresBy
   */
  async resend2FAOtpCode(input: Resend2FAOtpCodeDTO): Promise<ResendOtpCodeResponse> {
    const { email } = input;
    try {
      const user = await this.adminRepository.findOne({ email });
      if (!user) {
        throw new NotFoundException(
          this.i18nService.t('common.not_exist', { args: { entity: 'User' } }),
        );
      }
      const result = await this.otpService.sendEmailOTP({ ...input }, RequestedFor.cms_login);

      return {
        expiresAt: result.expiresAt,
        expiresBy: result.expiresBy,
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @returns {*}
   */
  generateRandomBase32 = () => {
    const buffer = crypto.randomBytes(15);
    const base32 = encode(buffer).replace(/=/g, '').substring(0, 24);
    return base32;
  };

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} userId
   * @returns {Promise<AuthUrlResponse>}
   */
  async generateOtpAuthUrl(userId: string): Promise<AuthUrlResponse> {
    const user = await this.adminRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'User' } }),
      );
    }

    const base32_secret = this.generateRandomBase32();

    const totp = new OTPAuth.TOTP({
      issuer: 'ebtheme.com',
      label: 'Ebtheme',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: base32_secret,
    });

    const otpAuthUrl = totp.toString();
    await this.adminRepository.updateById(userId, {
      otpBase32: base32_secret,
      otpAuthUrl,
    });
    return {
      base32: base32_secret,
      otpAuthUrl,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {{ token: any; userId: any; }} param0
   * @param {*} param0.token
   * @param {*} param0.userId
   * @returns {Promise<VerifyAuthOtpResponse>\}
   */
  async verifyAuthOTP({ token, userId }): Promise<VerifyAuthOtpResponse> {
    try {
      const user = await this.adminRepository.findById(userId);

      if (!user) {
        throw new NotFoundException(
          this.i18nService.t('common.not_exist', { args: { entity: 'User' } }),
        );
      }
      const totp = new OTPAuth.TOTP({
        issuer: 'ebtheme.com',
        label: 'Ebtheme',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: user.otpBase32,
      });
      const delta = totp.validate({ token });

      if (delta === null) {
        throw new BadRequestException(this.i18nService.t('auth.invalid_otp'));
      }
      await this.adminRepository.updateById(userId, {
        enabled2FA: true,
        verified2FA: true,
      });
      return {
        message: this.i18nService.t('auth.two_factor_auth_enable_success'),
      };
    } catch (error) {
      if (error.response.message === this.i18nService.t('auth.invalid_otp')) {
        throw new HttpException(
          this.i18nService.t('auth.invalid_otp'),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {{ token: any; email: any; }} param0
   * @param {*} param0.token
   * @param {*} param0.email
   * @returns {Promise<AdminLoginResponse>\}
   */
  async validateAuthOTP({ token, email }): Promise<AdminLoginResponse> {
    try {
      const user = await this.adminRepository.findOne({ email });

      if (!user) {
        throw new NotFoundException(
          this.i18nService.t('common.not_exist', { args: { entity: 'User' } }),
        );
      }
      const totp = new OTPAuth.TOTP({
        issuer: 'ebtheme.com',
        label: 'Ebtheme',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: user.otpBase32,
      });
      const delta = totp.validate({ token });

      if (delta === null) {
        throw new BadRequestException(this.i18nService.t('auth.invalid_otp'));
      }

      const payload = { id: user._id };
      const accessToken = await this.jwtService.signAccessToken(payload);
      const refreshToken = await this.jwtService.signRefreshToken(payload);
      return {
        message: this.i18nService.t('auth.two_factor_auth_enable_success'),
        admin: user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} token
   * @param {string} userId
   * @returns {Promise<any>}
   */
  async disableAuthOTP(token, userId: string): Promise<any> {
    const user = await this.adminRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'User' } }),
      );
    }
    const totp = new OTPAuth.TOTP({
      issuer: 'ebtheme.com',
      label: 'Ebtheme',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: user.otpBase32,
    });
    const delta = totp.validate({ token });

    if (delta === null) {
      throw new BadRequestException(this.i18nService.t('auth.invalid_otp'));
    }
    await this.adminRepository.updateById(userId, {
      enabled2FA: false,
    });
    return true;
  }
}
