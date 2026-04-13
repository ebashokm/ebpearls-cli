import { Address, User, UsersRepository } from '@app/data-access';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as mongoose from 'mongoose';

import { ConfigService } from '@nestjs/config';
import { TokenService } from '../admin/service/token.service';
import { HashService } from '../auth/service/hash.service';
import * as crypto from 'crypto';
import { CreateAppUserDTO } from './dto/input/create-app-user.dto';
import { UpdateAppUserDTO } from './dto/input/update-app-user.dto';
import { GetAppUsersDTO } from './dto/input/get-app-users.dto';
import { AppUser, AuthProviderType, UserStatus } from './dto/entity/app-user.entity';
// import { Order } from '../../common/enum/pagination.enum';
import { AppUserChangePasswordDTO } from './dto/input/appUser-change-password.dto';
import { CometChatHelperService } from '@app/common/helpers/comet-chat.helper';
import { isAllowedExt } from '@app/common/helpers/genericFunction';
import { S3Service, S3_TEMP_FOLDER_NAME } from '@app/common/services/s3';
import { SignedUrlMethod } from '@app/common/enum/signed-url.enum';
import { AppUserResponse } from './dto/response/app-user.response';
import { EmailService } from '@app/email/email.service';
import { RequestedFor } from '@app/common/enum/otp-request.enum';
import { I18nService } from 'nestjs-i18n';
import { LocationService } from '@app/common/services/google/location.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EventsService } from '@app/common/services/sse/events.service';
import { UserEventsService } from '@app/common/services/sse/user.events.service';
import { PaginationOptions as PaginateOptions } from '@app/data-access/repository/pagination.type';
import { UserTermsVersionUpdatedEventDTO } from '../page-with-version/dto/event/user-terms-version-updated.event.dto';
import { LocationType } from '@app/common/enum/location-type.enum';
import { AppUserRecord } from './types/app-user.types';
import { Transactional } from '@nestjs-cls/transactional';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AppUserService
 * @typedef {AppUserService}
 */
@Injectable()
export class AppUserService {
  /**
   * Creates an instance of AppUserService.
   *
   * @constructor
   * @public
   * @param {UsersRepository} userRepository
   * @param {LocationService} locationService
   * @param {HashService} hashService
   * @param {EmailService} emailService
   * @param {CometChatHelperService} cometChatHelperService
   * @param {S3Service} s3Service
   * @param {TokenService} tokenService
   * @param {ConfigService} configService
   * @param { i18nService } i18nService
   */
  public constructor(
    private readonly userRepository: UsersRepository,
    private readonly locationService: LocationService,
    private readonly hashService: HashService,
    private readonly emailService: EmailService,
    private readonly cometChatHelperService: CometChatHelperService,
    private readonly s3Service: S3Service,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService,
    private readonly eventsService: EventsService,
    private readonly userEventsService: UserEventsService,
  ) {}

  /**
   * @description event listening to update termsVersionSynced which is emitted while creating page
   * @param {string} payload
   * @returns
   */
  @OnEvent('user.termsVersionUpdated')
  async handleTermsVersionUpdate(payload: UserTermsVersionUpdatedEventDTO) {
    await this.userRepository.updateMany(
      { isTermsVersionSynced: true },
      { isTermsVersionSynced: payload.isTermsVersionSynced },
    );

    this.eventsService.sendEvent({
      type: 'terms-and-condition-version-updated',
      data: { version: 'v1' },
    });
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateAppUserDTO} input
   * @returns {Promise<any>}
   */
  @Transactional()
  async createUser(input: CreateAppUserDTO) {
    try {
      const { authProvider, authProviderId, firstName, lastName, address, profileImage, bio } =
        input;

      // Note: uncomment this if coordinates should be added
      // const {
      //   data: { data: locData },
      // } = await this.locationService.getCoordinates(address);
      // /* build location */
      // if (locData.length < 1) {
      //   throw new BadRequestException(lang.BAD_LOCATION);
      // }
      // const loc = {
      //   displayAddress: locData[0].name,
      //   location: {
      //     type: 'Point',
      //     coordinates: [locData[0].longitude, locData[0].latitude],
      //   },
      // };
      const loc = {
        displayAddress: address,
        location: {
          type: 'Address',
        },
      };

      const genPass = crypto.randomBytes(32).toString('hex');

      if (profileImage !== undefined) {
        const allowedExtensions = ['jpg', 'png', 'jpeg'];
        if (profileImage && !isAllowedExt(profileImage, allowedExtensions)) {
          throw new BadRequestException(
            this.i18nService.t('common.extension_not_allowed', { args: { entity: 'Image' } }),
          );
        }
      }

      const appUSer = await this.userRepository.findOne({
        authProvider,
        authProviderId,
      });

      if (appUSer) {
        throw new BadRequestException(
          this.i18nService.t('common.already_exists', { args: { entity: 'User' } }),
        );
      }

      const createdAppUser: AppUserRecord & {} = await this.userRepository.create({
        authProvider,
        authProviderId,
        firstName,
        lastName,
        profileImage,
        password: await this.hashService.hashPassword(genPass),
        address: loc,
        status: UserStatus.password_set_pending,
        bio,
      });

      if (createdAppUser?.profileImage) {
        const profileImageKey = `public/profiles/${createdAppUser._id}/${createdAppUser.profileImage}`;
        await this.s3Service.copyObject(
          `${S3_TEMP_FOLDER_NAME}/${createdAppUser.profileImage}`,
          profileImageKey,
        );
        createdAppUser.profileImageUrl = await this.s3Service.getPreSignedUrl(
          profileImageKey,
          SignedUrlMethod.GET,
        );
      }

      //   /* send reset password link */
      const token = await this.tokenService.generateToken(createdAppUser._id.toString());

      /* build the reset link */
      const link = `${this.configService.get(
        'CMS_PORTAL_URI',
      )}/app-user-reset-password?userId=${createdAppUser._id}&token=${token.token}`;

      const values = {
        link,
        name: `${createdAppUser.firstName} ${createdAppUser.lastName}`,
      };

      this.emailService.sendEmail({
        to: authProviderId,
        values,
        slug: RequestedFor.verify_email_set_password,
      });

      return createdAppUser;
    } catch (error) {
      if (error.message.includes('E11000')) {
        throw new HttpException(
          this.i18nService.t('common.error_operation', { args: { entity: 'database' } }),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }

  /**
   * Sends a reset password mail to the user with the given email.
   *
   * @param {string} email - The email of the user.
   * @param {string} userId - The ID of the user.
   * @param {string} name - The name of the user.
   * @return {Promise<boolean>} - A promise that resolves to true if the reset password mail is sent successfully.
   * @throws {NotFoundException} - If the user with the given email is not found.
   * @throws {HttpException} - If there is an error in performing the database operation.
   */
  async sendResetPasswordMail(email: string, userId: string, name: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({ authProviderId: email });
      if (!user) {
        throw new NotFoundException(
          this.i18nService.t('common.not_exist', { args: { entity: 'User' } }),
        );
      }

      //   /* send reset password link */
      let token = await this.tokenService.getToken(userId);
      if (!token) {
        token = await this.tokenService.generateToken(userId);
      }

      /* build the reset link */
      const link = `${this.configService.get(
        'CMS_PORTAL_URI',
      )}/app-user-reset-password?userId=${userId}&token=${token.token}`;

      const values = {
        link,
        name,
      };

      this.emailService.sendEmail({
        to: email,
        values,
        slug: RequestedFor.reset_password,
      });

      return true;
    } catch (error) {
      if (error.message.includes('E11000')) {
        throw new HttpException(
          this.i18nService.t('common.error_operation', { args: { entity: 'database' } }),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }

  /**
   * @description change appuser password
   * @param {ChangePasswordDTO} input change password data
   * @param {string} userId user id
   * @returns {Boolean} true if successful
   */
  @Transactional()
  async changePassword(input: AppUserChangePasswordDTO) {
    const { password, id } = input;

    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        throw new NotFoundException(
          this.i18nService.t('common.not_exist', { args: { entity: 'UserId' } }),
        );
      }

      /* update user password*/
      const hash = await this.hashService.apphashPassword(password);

      await this.userRepository.updateById(id, {
        password: hash,
      });

      return true;
    } catch (e) {
      throw new BadRequestException(e?.message);
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
      throw new UnauthorizedException('Invalid token');
    }
    const hash = await this.hashService.apphashPassword(password);

    /* update user password & delete token */
    await this.userRepository.updateById(
      userId,
      {
        $set: {
          password: hash,
          status: 'email_verified',
        },
      },
      { new: true },
    );

    await this.tokenService.removeToken(token);

    return true;
  }

  /**
   * Updates a user with the given ID using the provided input.
   *
   * @param {string} id - The ID of the user to update.
   * @param {UpdateAppUserDTO} input - The input containing the updated user information.
   * @return {Promise<AppUserResponse>} The updated user.
   * @throws {NotFoundException} If the user with the given ID is not found.
   * @throws {BadRequestException} If the provided address is invalid.
   * @throws {HttpException} If an error occurs during the update process.
   */
  @Transactional()
  async updateUser(id: string, input: UpdateAppUserDTO) {
    const { authProvider, authProviderId, firstName, lastName, profileImage, address, bio } = input;

    try {
      const appUser = await this.userRepository.findById(id);
      if (!appUser) {
        throw new NotFoundException(
          this.i18nService.t('common.not_exist', { args: { entity: 'UserId' } }),
        );
      }

      // Build location if address is updated
      const loc = await this.buildLocation(appUser.address, address);

      // Handle profile image logic
      const { isProfileUpdated, prevImageKey } = await this.handleProfileImage(
        profileImage,
        appUser?.profileImage,
      );

      // Update user data
      const updatedAppUser: AppUserRecord = await this.updateUserData(id, {
        authProvider: AuthProviderType[authProvider],
        authProviderId,
        firstName,
        lastName,
        address: loc,
        bio,
        profileImage,
      });

      // Handle profile image upload if updated
      if (updatedAppUser?.profileImage) {
        await this.handleProfileImageUpload(updatedAppUser, prevImageKey, isProfileUpdated);
      }

      return updatedAppUser;
    } catch (error) {
      if (error.message.includes('E11000')) {
        throw new HttpException(
          this.i18nService.t('common.error_operation', { args: { entity: 'database' } }),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }

  // Build location if address is updated
  async buildLocation(currentAddress: Address, newAddress: string | undefined): Promise<Address> {
    if (currentAddress?.displayAddress === newAddress) {
      return { ...currentAddress };
    }

    const {
      data: { data: locData },
    } = await this.locationService.getCoordinates(newAddress);

    if (locData.length < 1) {
      throw new BadRequestException(this.i18nService.t('appUser.invalid_location'));
    }

    return {
      displayAddress: locData[0].name,
      location: {
        type: LocationType.Point,
        coordinates: [locData[0].longitude, locData[0].latitude],
      },
    };
  }

  // Handle profile image validation and state
  async handleProfileImage(profileImage: string | undefined, prevImageKey: string | undefined) {
    let isProfileUpdated = false;

    if (profileImage !== undefined) {
      const allowedExtensions = ['jpg', 'png', 'jpeg'];
      if (profileImage && !isAllowedExt(profileImage, allowedExtensions)) {
        throw new BadRequestException(
          this.i18nService.t('common.extension_not_allowed', { args: { entity: 'Image' } }),
        );
      }

      if (profileImage !== prevImageKey) {
        isProfileUpdated = true;
      }
    }

    return { isProfileUpdated, prevImageKey };
  }

  // Update user data in the repository
  async updateUserData(id: string, data: Partial<User>) {
    return await this.userRepository.updateById(id, data, { new: true });
  }

  // Handle profile image upload to S3
  async handleProfileImageUpload(
    updatedAppUser: AppUserRecord,
    prevImageKey: string | undefined,
    isProfileUpdated: boolean,
  ) {
    const profileImageKey = `public/profiles/${updatedAppUser._id}/${updatedAppUser.profileImage}`;

    if (isProfileUpdated) {
      await this.s3Service.copyObject(
        `${S3_TEMP_FOLDER_NAME}/${updatedAppUser.profileImage}`,
        profileImageKey,
      );
    }

    updatedAppUser.profileImageUrl = await this.s3Service.getPreSignedUrl(
      profileImageKey,
      SignedUrlMethod.GET,
    );
    updatedAppUser.profileImageThumbnails = await this.s3Service.getAllThumbnail(profileImageKey);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  @Transactional()
  async deleteUser(id: string): Promise<boolean> {
    const appUser = await this.userRepository.findById(id);
    if (!appUser) {
      throw new NotFoundException('UserID does not exist');
    }

    await this.userRepository.softDeleteById(id);
    await this.cometChatHelperService.deleteCometChatUser(String(id));

    this.userEventsService.sendEventToUser(id.toString(), {
      type: 'delete-user',
      data: { userId: id.toString() },
    });

    return true;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetAppUsersDTO} input
   * @returns {Promise<any>}
   */
  async getAllUsers(input: GetAppUsersDTO) {
    const { searchText, orderBy, order, limit, skip } = input;

    const pageMeta: PaginateOptions = { limit, skip, orderBy, order };

    // Build filter object
    const filter: mongoose.FilterQuery<User> = {};
    if (searchText) {
      filter.$or = [
        { firstName: { $regex: searchText, $options: 'i' } },
        { lastName: { $regex: searchText, $options: 'i' } },
        { authProviderId: { $regex: searchText, $options: 'i' } },
      ];
    }

    return this.userRepository.getAllUsers(pageMeta, filter);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<any>}
   */
  async getUser(id: string): Promise<any[]> {
    /* create pipeline */
    const Oid = new mongoose.Types.ObjectId(id);
    const filter = [{ $match: { isDeleted: { $ne: true }, _id: { $eq: Oid } } }];
    return this.userRepository.getUsers(filter);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<any>}
   */
  async getUserById(id: string) {
    try {
      const user: AppUserRecord = await this.userRepository.findById(id);
      if (user?.profileImage) {
        const profileImageKey = `public/profiles/${user._id}/${user.profileImage}`;
        user.profileImageUrl = await this.s3Service.getPreSignedUrl(
          profileImageKey,
          SignedUrlMethod.GET,
        );
      }
      return user;
    } catch (error: any) {
      throw error;
    }
  }
}
