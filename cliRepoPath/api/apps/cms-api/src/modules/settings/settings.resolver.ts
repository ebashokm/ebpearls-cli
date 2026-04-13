import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Settings, SettingsResponse } from './dto/response/settings.response';
import { SettingService } from './settings.service';
import { UpdateSettingsDto } from './dto/input/update.settings.input';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.authguard';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SettingResolver
 * @typedef {SettingResolver}
 */
@Resolver(() => Settings)
export class SettingResolver {
  /**
   * Creates an instance of SettingResolver.
   *
   * @constructor
   * @param {SettingService} settingService
   */
  constructor(private readonly settingService: SettingService) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<{ message: any; settings: any; }>\}
   */
  @Query(() => SettingsResponse)
  // @Auth(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, AdminRoles.EDITOR)
  async listSettings(@I18n() i18n: I18nContext) {
    const settings = await this.settingService.getAllSettings();
    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'Settings' } }),
      settings,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {UpdateSettingsDto} input
   * @returns {Promise<{ message: any; settings: any[]; }>\}
   */
  @Mutation(() => SettingsResponse)
  @UseGuards(JwtAuthGuard)
  async updateSettings(
    @Args('input')
    input: UpdateSettingsDto,
    @I18n() i18n: I18nContext,
  ) {
    await this.settingService.updateSettings(input);
    const updatedSettings = await this.settingService.getAllSettings();
    return {
      message: i18n.t('common.update_success', { args: { entity: 'Settings' } }),
      settings: updatedSettings,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} slug
   * @returns {Promise<{ setting: any; }>\}
   */
  @Query(() => SettingsResponse)
  async getSettingBySlug(@Args('slug') slug: string) {
    const setting = await this.settingService.getSettingBySlug(slug);
    return {
      setting,
    };
  }
}
