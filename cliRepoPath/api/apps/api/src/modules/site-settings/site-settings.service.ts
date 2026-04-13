import { Injectable } from '@nestjs/common';
import { SiteSetting, SiteSettingsRepository } from '@app/data-access/site-settings';
import { UpdateSettingInput } from './dto/input/update-settings.input';

/**
 * Service for managing site settings.
 *
 * @export
 * @class SiteSettingsService
 */
@Injectable()
export class SiteSettingsService {
  /**
   * Initializes the service with the settings repository.
   *
   * @constructor
   * @param {SiteSettingsRepository} siteSettingsRepository
   */
  constructor(private readonly siteSettingsRepository: SiteSettingsRepository) {}

  /**
   * Retrieves a specific setting for a user.
   *
   * @async
   * @param {string} key - The setting key to fetch.
   * @param {string} userId - The user's ID.
   * @returns {Promise<SiteSetting>} The user's setting.
   */
  async getMySetting(key: string, userId: string): Promise<SiteSetting> {
    const setting = await this.siteSettingsRepository.getMySetting(key, userId, 'User');
    setting.value = Array.isArray(setting.value) ? setting.value : [setting.value];
    return setting;
  }

  /**
   * Retrieves all settings for a user.
   *
   * @async
   * @param {string} userId - The user's ID.
   * @returns {Promise<SiteSetting[]>} The list of user's settings.
   */
  async getMySettings(userId: string): Promise<SiteSetting[]> {
    const settings = await this.siteSettingsRepository.getMySettings(userId, 'User');
    return settings.map((setting) => {
      setting.value = Array.isArray(setting.value) ? setting.value : [setting.value];
      return setting;
    });
  }

  /**
   * Initializes default settings for a user.
   *
   * @async
   * @param {string} userId - The user's ID.
   * @returns {Promise<void>}
   */
  async initMyDefaultSettings(userId: string): Promise<void> {
    await this.siteSettingsRepository.initMyDefaultSettings(userId, 'User');
  }

  /**
   * Updates the user's settings.
   *
   * @async
   * @param {string} userId - The user's ID.
   * @param {UpdateSettingInput[]} settings - The updated settings.
   * @returns {Promise<void>}
   */
  async updateMySettings(userId: string, settings: UpdateSettingInput[]): Promise<void> {
    await this.siteSettingsRepository.updateMySettings(userId, 'User', settings);
  }
}
