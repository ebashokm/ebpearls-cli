import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { LoginDetail } from '../auth/decorator/login.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { I18n, I18nContext } from 'nestjs-i18n';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettingsResponse } from './dto/response/site-settings.response';
import { SiteSetting } from '@app/data-access/site-settings';
import { UpdateSettingInput } from './dto/input/update-settings.input';
import { LoginDetailType } from '../auth/types/login-detail.type';

/**
 * The SiteSettingsResolver is responsible for handling GraphQL queries and mutations
 * related to the site settings in the system. It interacts with the SiteSettingsService
 * to perform operations such as initializing default settings, updating settings, and
 * retrieving user-specific settings. The resolver uses the I18n library for internationalization
 * and ensures that only authenticated users can perform these actions by using the AuthUserGuard.
 *
 * @export
 * @class SiteSettingsResolver
 */
@Resolver(() => SiteSetting)
export class SiteSettingsResolver {
  /**
   * Constructs an instance of SiteSettingsResolver.
   * The SiteSettingsService is injected to handle business logic related to
   * site settings operations.
   *
   * @constructor
   * @param {SiteSettingsService} siteSettingsService - Service responsible for site settings logic.
   */
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  /**
   * Initializes the default settings for the authenticated user.
   * This mutation allows a user to set up their default site settings.
   * The message returned will be translated using the I18nContext.
   * Guards are applied to ensure only authenticated users can invoke this.
   *
   * @param {I18nContext} i18n - The internationalization context for translating messages.
   * @param {*} loginDetail - The login details of the authenticated user.
   * @returns {{ message: string; }} - A success message after initializing default settings.
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => MessageResponse, { nullable: true })
  initMyDefaultSettings(
    @I18n() i18n: I18nContext,
    @LoginDetail() loginDetail: LoginDetailType,
  ): { message: string } {
    this.siteSettingsService.initMyDefaultSettings(loginDetail.userId);
    return { message: i18n.t('site_settings.default_setting_added') };
  }

  /**
   * Updates the site settings for the authenticated user.
   * Accepts an array of settings to be updated. The settings are validated
   * and updated for the logged-in user. The message is internationalized.
   *
   * @param {I18nContext} i18n - The internationalization context for translating messages.
   * @param {*} loginDetail - The login details of the authenticated user.
   * @param {UpdateSettingInput[]} settings - Array of settings to be updated.
   * @returns {{ message: string; }} - A success message after updating the settings.
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => MessageResponse, { nullable: true })
  updateMySettings(
    @I18n() i18n: I18nContext,
    @LoginDetail() loginDetail: LoginDetailType,
    @Args({ name: 'settings', type: () => [UpdateSettingInput] }) settings: UpdateSettingInput[],
  ): { message: string } {
    this.siteSettingsService.updateMySettings(loginDetail.userId, settings);
    return { message: i18n.t('site_settings.my_setting_updated') };
  }

  /**
   * Retrieves a specific setting for the authenticated user by key.
   * This query fetches the site setting associated with the given key for the logged-in user.
   * The response will contain the specific site setting details.
   *
   * @param {string} key - The key of the setting to retrieve. eg language, darkMode, siteDescription
   * @param {*} loginDetail - The login details of the authenticated user.
   * @returns {Promise<SiteSetting>} - The site setting corresponding to the provided key.
   */
  @UseGuards(AuthUserGuard)
  @Query(() => SiteSettingsResponse, { nullable: true })
  getMySetting(
    @Args('key') key: string,
    @LoginDetail() loginDetail: LoginDetailType,
  ): Promise<SiteSetting> {
    return this.siteSettingsService.getMySetting(key, loginDetail.userId);
  }

  /**
   * Retrieves all the site settings for the authenticated user.
   * This query fetches all the site settings for the logged-in user and returns them.
   *
   * @param {*} loginDetail - The login details of the authenticated user.
   * @returns {Promise<SiteSetting[]>} - An array of all site settings for the user.
   */
  @UseGuards(AuthUserGuard)
  @Query(() => [SiteSettingsResponse], { nullable: true })
  getMySettings(@LoginDetail() loginDetail: LoginDetailType): Promise<SiteSetting[]> {
    return this.siteSettingsService.getMySettings(loginDetail.userId);
  }
}
