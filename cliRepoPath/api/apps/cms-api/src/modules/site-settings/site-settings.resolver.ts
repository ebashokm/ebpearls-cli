import { SiteSetting } from '@app/data-access/site-settings';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SiteSettingsService } from './site-settings.service';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { I18n, I18nContext } from 'nestjs-i18n';
import { SiteSettingsResponse } from './dto/response/site-settings.response';
import { CurrentUser } from '../auth/decorator/get-user.decorator';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.authguard';

/**
 * Description placeholder
 *
 * @export
 * @class SiteSettingsResolver
 * @typedef {SiteSettingsResolver}
 */
@Resolver(() => SiteSetting)
export class SiteSettingsResolver {
  /**
   * Creates an instance of SiteSettingsResolver.
   *
   * @constructor
   * @param {SiteSettingsService} siteSettingsService
   */
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  /**
   * Description placeholder
   *
   * @param {I18nContext} i18n
   * @returns {{ message: any; }}
   */
  @Permissions('create-site-setting')
  @Mutation(() => MessageResponse, { nullable: true })
  initDefaultSettings(@I18n() i18n: I18nContext) {
    this.siteSettingsService.initDefaultSettings();
    return { message: i18n.t('site_settings.default_setting_added') };
  }

  /**
   * Get site setting by key
   *
   * @param {string} key
   * @returns {unknown}
   */
  @Permissions('get-site-setting')
  @Query(() => SiteSettingsResponse, { nullable: true })
  getSetting(@Args('key') key: string) {
    return this.siteSettingsService.getSetting(key);
  }

  /**
   * Get all site setting available
   *
   * @returns {unknown}
   */
  @Permissions('list-site-setting')
  @Query(() => [SiteSettingsResponse], { nullable: true })
  getSettings() {
    return this.siteSettingsService.getSettings();
  }

  /**
   * Setup initial site setting
   *
   * @param {I18nContext} i18n
   * @param {*} user
   * @returns {{ message: any; }}
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => MessageResponse, { nullable: true })
  initMyDefaultSettings(@I18n() i18n: I18nContext, @CurrentUser() user) {
    this.siteSettingsService.initMyDefaultSettings(user.id);
    return { message: i18n.t('site_settings.default_setting_added') };
  }

  /**
   * Get current login user site setting
   *
   * @param {string} key
   * @param {*} user
   * @returns {unknown}
   */
  @UseGuards(JwtAuthGuard)
  @Query(() => SiteSettingsResponse, { nullable: true })
  getMySetting(@Args('key') key: string, @CurrentUser() user) {
    return this.siteSettingsService.getMySetting(key, user.id);
  }

  /**
   * Get current login user all site settings
   *
   * @param {*} user
   * @returns {unknown}
   */
  @UseGuards(JwtAuthGuard)
  @Query(() => [SiteSettingsResponse], { nullable: true })
  getMySettings(@CurrentUser() user) {
    return this.siteSettingsService.getMySettings(user.id);
  }
}
