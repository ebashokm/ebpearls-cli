import { HttpException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateAppUserDTO } from './dto/input/create-app-user.dto';
import { GetAppUsersDTO } from './dto/input/get-app-users.dto';
import { UpdateAppUserDTO } from './dto/input/update-app-user.dto';
import { AppUserResponse } from './dto/response/app-user.response';
import { AppUserService } from './app-user.service';
import { AppUserChangePasswordDTO } from './dto/input/appUser-change-password.dto';
import { ChangePasswordResponse } from '../auth/dto/response/auth-response';
import { AppUserResetPasswordDTO } from './dto/input/app-user-reset-password.dto';
import { ParseObjectIdPipe } from '@app/common/pipe/parse-mongoid.pipe';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { AppUser } from './dto/entity/app-user.entity';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AppUserResolver
 * @typedef {AppUserResolver}
 */
@Resolver(() => AppUser)
export class AppUserResolver {
  /**
   * Creates an instance of AppUserResolver.
   *
   * @constructor
   * @param {AppUserService} userService
   */
  constructor(private readonly userService: AppUserService) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateAppUserDTO} input
   * @returns {Promise<{ message: any; user: any; }>\}
   */
  @Permissions('create-user')
  @Mutation(() => AppUserResponse)
  async createAppUser(@Args('input') input: CreateAppUserDTO, @I18n() i18n: I18nContext) {
    const appUser = await this.userService.createUser(input);

    return {
      message: i18n.t('common.create_success', { args: { entity: 'AppUser' } }),
      user: appUser,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} email
   * @param {string} userId
   * @param {string} name
   * @returns {Promise<string>}
   */
  @Permissions('send-password-reset-mail-to-user')
  @Mutation(() => String)
  async sendPasswordResetMail(
    @Args('email') email: string,
    @Args('userId')
    userId: string,
    @Args('name')
    name: string,
    @I18n() i18n: I18nContext,
  ) {
    await this.userService.sendResetPasswordMail(email, userId, name);
    return i18n.t('auth.password_reset_mail_send');
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {UpdateAppUserDTO} input
   * @returns {Promise<{ message: any; user: AppUserResponse; }>\}
   */
  @Permissions('update-user')
  @Mutation(() => AppUserResponse)
  async updateAppUser(
    @Args('id') id: string,
    @Args('input') input: UpdateAppUserDTO,
    @I18n() i18n: I18nContext,
  ) {
    const appUser = await this.userService.updateUser(id, input);

    return {
      message: i18n.t('common.update_success', { args: { entity: 'Appuser' } }),
      user: appUser,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<{ message: any; }>\}
   */
  @Mutation(() => AppUserResponse)
  @Permissions('delete-user')
  async deleteAppUser(@Args('id', new ParseObjectIdPipe()) id: string, @I18n() i18n: I18nContext) {
    try {
      await this.userService.deleteUser(id);
      return { message: i18n.t('common.delete_success', { args: { entity: 'Appuser' } }) };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetAppUsersDTO} input
   * @returns {Promise<{ message: any; users: any; pagination: any; }>\}
   */
  @Permissions('list-user')
  @Query(() => AppUserResponse)
  async getAllAppUsers(@Args('input') input: GetAppUsersDTO, @I18n() i18n: I18nContext) {
    const appUsers = await this.userService.getAllUsers(input);

    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'Appuser' } }),
      users: appUsers.data,
      pagination: appUsers.pagination,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<{ message: any; user: any; }>\}
   */
  @Permissions('get-user')
  @Query(() => AppUserResponse)
  async getAppUser(@Args('id', new ParseObjectIdPipe()) id: string, @I18n() i18n: I18nContext) {
    const appUser = await this.userService.getUserById(id);

    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'Appuser' } }),
      user: appUser,
    };
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
   * @param {AppUserResetPasswordDTO} input
   * @returns {Promise<boolean>}
   */
  @Permissions('reset-user-password')
  @Mutation(() => Boolean, { name: 'appUserResetPassword' })
  async appUserResetPassword(@Args('input') input: AppUserResetPasswordDTO) {
    const { userId, token, password } = input;

    return this.userService.resetPassword(userId, token, password);
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
   * @param {AppUserChangePasswordDTO} input
   * @returns {Promise<{ message: any; }>\}
   */
  @Permissions('change-user-password')
  @Mutation(() => ChangePasswordResponse, { name: 'appUserchangePassword' })
  async changePassword(@Args('input') input: AppUserChangePasswordDTO, @I18n() i18n: I18nContext) {
    const body = { ...input };
    await this.userService.changePassword(body);
    return { message: i18n.t('auth.password_change_success') };
  }
}
