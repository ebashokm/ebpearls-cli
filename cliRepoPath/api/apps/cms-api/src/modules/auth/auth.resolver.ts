import { UseGuards, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminType } from '../admin/dto/response/admin.response';
import { CurrentUser } from './decorator/get-user.decorator';
import { ChangePasswordDTO } from './dto/input/change-password.dto';
import { CreateAdminDTO } from './dto/input/create-admin.dto';
import { LoginAdminDTO } from './dto/input/login-admin.dto';
import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  ResetPasswordOtpVerificationDTO,
} from './dto/input/reset-password.dto';
import {
  AdminLoginResponse,
  ChangePasswordResponse,
  RefreshTokenResponse,
} from './dto/response/auth-response';
import { JwtAuthGuard } from './guard/jwt.authguard';
import { AuthService } from './service/auth.service';
import { ResetPWOtpVerificationResponse } from './dto/response/reset-password.dto';
import {
  AuthUrlResponse,
  ResendOtpCodeResponse,
  VerifyAuthOtpResponse,
} from './dto/response/2fa-response';
import {
  OtpVerificationFor2FADTO,
  Resend2FAOtpCodeDTO,
  ValidateAuthOTPInput,
} from './dto/input/2fa-otp.dto';
import { ForgotPasswordResponse } from './dto/response/forgort-password-response';
import { TokenService } from '../admin/service/token.service';
import { AdminRepository } from '@app/data-access';
import { SettingService } from '../settings/settings.service';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AuthResolver
 * @typedef {AuthResolver}
 */
@Resolver()
export class AuthResolver {
  /**
   * Creates an instance of AuthResolver.
   *
   * @constructor
   * @param {AuthService} authService
   * @param {S3Service} s3Service
   * @param {TokenService} tokenService
   * @param {AdminRepository} adminRepository
   */
  constructor(
    private readonly authService: AuthService,
    //private cloudFrontService: CloudFrontService,
    private readonly tokenService: TokenService,
    private readonly adminRepository: AdminRepository,
    private readonly settingService: SettingService,
  ) {}

  /*
  @desc     Get user details
  @access   Private
  @res      getUserProfile 
   */
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} user
   * @returns {Promise<any>}
   */
  @UseGuards(JwtAuthGuard)
  @Query(() => AdminType, { name: 'getUserProfile', nullable: true })
  async getUserProfile(@CurrentUser() user) {
    try {
      return await this.authService.getProfile(user.id);
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /*
  @desc     User login
  @access   Public
  @res      login 
  @params   {email: string, password: string}
   */
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {LoginAdminDTO} input
   * @param {*} context
   * @returns {Promise<any>}
   */
  @Mutation(() => AdminLoginResponse, { name: 'login' })
  // @UseGuards(GqlAuthGuard)
  async login(@Args('input') input: LoginAdminDTO, @Context() context) {
    const { browser } = context.req.body;
    const ip = context.req.headers['x-forwarded-for'] || '';
    const agent = context.req.headers['user-agent'];
    const { email, password } = input;

    // Manually validate user credentials
    const user = await this.authService.validate(email, password, browser, ip, agent);
    const response = await this.authService.login(user, browser);
    const settings = await this.settingService.getAllSettings();
    return { ...response, settings };
  }

  /*
  @desc     Register Admin
  @access   Public
  @res      register 
  @params    {name: string, email: string, password: string, roles: string[], phone: string}
   */
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateAdminDTO} input
   * @returns {Promise<any>}
   */
  @Mutation(() => AdminType, { name: 'register' })
  async signup(@Args('input') input: CreateAdminDTO) {
    const newAdmin = await this.authService.createAdmin(input);
    if (!newAdmin) {
      throw new BadRequestException();
    }

    return newAdmin;
  }

  /*
  @desc     Change user password
  @access   Public
  @res      changePassword 
  @params   {userId: string, password: string}
   */
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {ForgotPasswordDTO} input
   * @returns {Promise<any>}
   */
  @Mutation(() => ForgotPasswordResponse, { name: 'forgotPassword' })
  async forgotPassword(@Args('input') input: ForgotPasswordDTO) {
    const result = await this.authService.forgotPassword(input);
    if (!result) {
      throw new BadRequestException();
    }

    return result;
  }

  /*
  @desc     Verify otp for reset password
  @access   Public
  @res      resetPasswordOtpVerification
  @params   {userId: string, password: string}
   */
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {ResetPasswordOtpVerificationDTO} input
   * @returns {Promise<any>}
   */
  @Mutation(() => ResetPWOtpVerificationResponse, {
    name: 'resetPasswordOtpVerification',
  })
  async resetPasswordOtpVerification(@Args('input') input: ResetPasswordOtpVerificationDTO) {
    const result = await this.authService.resetPasswordOtpVerification(input);
    return { ...result };
  }

  /*
  @desc     Change user password
  @access   Private
  @res      changePassword 
  @params   {userId: string, password: string}
   */
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {ResetPasswordDTO} input
   * @returns {Promise<any>}
   */
  @Mutation(() => Boolean, { name: 'resetPassword' })
  async resetPassword(@Args('input') input: ResetPasswordDTO) {
    const { userId, token, password } = input;
    return this.authService.resetPassword(userId, token, password);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {ResetPasswordDTO} input
   * @returns {Promise<boolean>}
   */
  @Mutation(() => Boolean, { name: 'verifyToken' })
  async verifyToken(@Args('input') input: ResetPasswordDTO) {
    const { userId, token } = input;
    const validToken = await this.tokenService.validate(userId, token);
    if (!validToken) {
      throw new UnauthorizedException('Invalid link');
    }
    return true;
  }

  /*
  @desc     Change user password
  @access   Private
  @res      changePassword 
  @params   {userId: string, password: string}
   */
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {ChangePasswordDTO} input
   * @param {*} context
   * @returns {Promise<{ message: any; status: any; }>\}
   */
  @Mutation(() => ChangePasswordResponse, { name: 'changePassword' })
  @UseGuards(JwtAuthGuard)
  async changePassword(@Args('input') input: ChangePasswordDTO, @Context() context) {
    const body = { ...input };
    const userId = context?.req?.user?.id;
    const status = await this.authService.changePassword(body, userId);
    return { message: 'Password changed succesfully', status };
  }

  /**
   * Get new refresh tokens
   * @param refreshToken
   * @returns
   */
  @Mutation(() => RefreshTokenResponse, { name: 'refresh' })
  async refreshToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
  /*
  @desc     Verify otp for 2FA
  @access   Public
  @res      OtpVerificationFor2FA
  @params   {email: string, otp: string}
   */
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {OtpVerificationFor2FADTO} input
   * @returns {Promise<any>}
   */
  @Mutation(() => AdminLoginResponse, {
    name: 'otpVerificationFor2FA',
  })
  async otpVerificationFor2FA(@Args('input') input: OtpVerificationFor2FADTO) {
    const result = await this.authService.otpVerificationFor2FA(input);
    return { ...result };
  }

  /*
  @desc     Verify otp for 2FA
  @access   Public
  @res      OtpVerificationFor2FA
  @params   {email: string, otp: string}
   */
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {Resend2FAOtpCodeDTO} input
   * @returns {Promise<any>}
   */
  @Mutation(() => ResendOtpCodeResponse, {
    name: 'resendOtpCode',
  })
  async resend2FAOtpCode(@Args('input') input: Resend2FAOtpCodeDTO) {
    const result = await this.authService.resend2FAOtpCode({
      ...input,
    });
    return { ...result };
  }

  /*
  @desc     generate otp auth url
  @access   Private
  @res      generateOtpAuthUrl 
   */
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} user
   * @returns {Promise<any>}
   */
  @Query(() => AuthUrlResponse, { name: 'generateOtpAuthUrl' })
  @UseGuards(JwtAuthGuard)
  async generateOtpAuthUrl(@CurrentUser() user) {
    const otpAuthUrl = await this.authService.generateOtpAuthUrl(user.id);
    return otpAuthUrl;
  }

  /**
   * verify auth otp
   * @param token
   * @returns
   */
  @Mutation(() => VerifyAuthOtpResponse, { name: 'verifyAuthOTP' })
  @UseGuards(JwtAuthGuard)
  async verifyAuthOTP(@Args('token') token: string, @Context() context) {
    const userId = context?.req?.user?.id;
    return this.authService.verifyAuthOTP({ token, userId });
  }

  /**
   * verify auth otp
   * @param ValidateAuthOTPInput
   * @returns
   */
  @Mutation(() => AdminLoginResponse, { name: 'validateAuthOTP' })
  async validateAuthOTP(@Args('input') input: ValidateAuthOTPInput) {
    const { email, otp } = input;
    return this.authService.validateAuthOTP({ token: otp, email });
  }

  /**
   * disable otp authenticator
   * @returns
   */
  @Mutation(() => Boolean, { name: 'disableAuthOTP' })
  @UseGuards(JwtAuthGuard)
  async disableAuthOTP(@Args('token') token: string, @Context() context) {
    const userId = context?.req?.user?.id;
    if (userId) {
      return this.authService.disableAuthOTP(token, userId);
    }
  }

  @Query(() => String)
  getCsrfToken(@Context('req') req): string {
    return req.csrfToken(); // Returns the CSRF token
  }
}
