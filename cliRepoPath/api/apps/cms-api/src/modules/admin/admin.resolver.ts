import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminDocument } from '@app/data-access';
import { CurrentUser } from '../auth/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.authguard';
import { UpdateAdminDTO } from './dto/input/update-admin.dto';
import { AdminService } from './service/admin.service';
import { AdminResponse, AdminType } from './dto/response/admin.response';
import { GetAdminListDTO } from './dto/input/get-adminList.dto';
import { UpdateAdminStatusInput } from './dto/input/update-admin-status.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Permissions } from '../auth/decorator/permissions.decorator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AdminResolver
 * @typedef {AdminResolver}
 */
@Resolver(() => AdminType)
export class AdminResolver {
  /**
   * Creates an instance of AdminResolver.
   *
   * @constructor
   * @param {AdminService} adminService
   */
  constructor(private readonly adminService: AdminService) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetAdminListDTO} input
   * @param {*} user
   * @returns {Promise<{ message: string; adminList: any; pagination: any; }>\}
   */
  @Permissions('list-admin')
  @Query(() => AdminResponse, { name: 'getAdminList' })
  async getAllAdmins(
    @Args('input') input: GetAdminListDTO,
    @CurrentUser() user,
    @I18n() i18n: I18nContext,
  ) {
    // const adminList = {data:[],pagination:{}}
    const adminList = await this.adminService.getAllAdmins(input, user);
    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'Admin' } }),
      adminList: adminList.data,
      pagination: adminList.pagination,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<{ message: string; admin: AdminDocument; }>\}
   */
  @Permissions('get-admin')
  @Query(() => AdminResponse, { name: 'getAdmin' })
  async getAdmin(@Args('id') id: string, @I18n() i18n: I18nContext) {
    const admin: AdminDocument = await this.adminService.getAdminById(id);

    return {
      message: i18n.t('common.fetch_detail_success', { args: { entity: 'Admin' } }),
      admin,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {UpdateAdminDTO} data
   * @param {*} user
   * @returns {Promise<{ message: string; admin: any; }>\}
   */
  @Mutation(() => AdminResponse, { name: 'updateAdmin' })
  @UseGuards(JwtAuthGuard)
  async updateAdminDetails(
    @Args('id') id: string,
    @Args('input') data: UpdateAdminDTO,
    @CurrentUser() user,
    @I18n() i18n: I18nContext,
  ) {
    const updated = await this.adminService.updateAdmin(id, user.id, user.roles, data);

    return {
      message: i18n.t('common.update_success', { args: { entity: 'Admin' } }),
      admin: updated,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {UpdateAdminStatusInput} data
   * @param {*} user
   * @returns {Promise<{ message: string; admin: any; }>\}
   */
  @Mutation(() => AdminResponse, { name: 'updateAdminStatus' })
  @UseGuards(JwtAuthGuard)
  async updateAdminStatus(
    @Args('input') data: UpdateAdminStatusInput,
    @CurrentUser() user,
    @I18n() i18n: I18nContext,
  ) {
    const updatedAdmin = await this.adminService.updateAdminStatus(user.id, user.roles, data);

    return {
      message: i18n.t('common.update_status_success', { args: { entity: 'Admin' } }),
      admin: updatedAdmin,
    };
  }

  @Permissions('send-password-reset-mail-to-admin')
  @Mutation(() => String)
  async sendAdminPasswordResetMail(
    @Args('email') email: string,
    @Args('userId')
    userId: string,
    @Args('name')
    name: string,
    @I18n() i18n: I18nContext,
  ) {
    await this.adminService.sendAdminResetPasswordMail(email, userId, name);
    return i18n.t('auth.password_reset_mail_send');
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {*} user
   * @returns {Promise<{ message: string; }>\}
   */
  @Mutation(() => AdminResponse, { name: 'removeAdmin' })
  @UseGuards(JwtAuthGuard)
  async deleteAdmin(@Args('id') id: string, @CurrentUser() user, @I18n() i18n: I18nContext) {
    await this.adminService.deleteAdminById(id, user.id);
    return { message: i18n.t('common.delete_success', { args: { entity: 'Admin' } }) };
  }
}
