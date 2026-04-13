import { BadRequestException, Injectable } from '@nestjs/common';
import { SiteSettingsRepository } from '@app/data-access/site-settings';

/**
 * Description placeholder
 *
 * @export
 * @class SiteSettingsService
 * @typedef {SiteSettingsService}
 */
@Injectable()
export class SiteSettingsService {
  /**
   * Creates an instance of SiteSettingsService.
   *
   * @constructor
   * @param {SiteSettingsRepository} siteSettingsRepository
   */
  constructor(private readonly siteSettingsRepository: SiteSettingsRepository) {}

  /**
   * Description placeholder
   *
   * @async
   * @param {string} key
   * @returns {unknown}
   */
  async getSetting(key: string) {
    try {
      const setting = await this.siteSettingsRepository.getSetting(key);
      const normalizedValue = Array.isArray(setting.value) ? setting.value : [setting.value];
      setting.value = normalizedValue;

      return setting;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @returns {unknown}
   */
  async getSettings() {
    try {
      const settings = await this.siteSettingsRepository.getSettings();
      const processedSettings = settings.map((setting) => {
        const normalizedValue = Array.isArray(setting.value) ? setting.value : [setting.value];
        setting.value = normalizedValue;
        return setting;
      });

      return processedSettings;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @returns {*}
   */
  async initDefaultSettings() {
    try {
      await this.siteSettingsRepository.initDefaultSettings();
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} key
   * @param {string} userId
   * @returns {unknown}
   */
  async getMySetting(key: string, userId: string) {
    try {
      const setting = await this.siteSettingsRepository.getMySetting(key, userId, 'Admin');
      const normalizedValue = Array.isArray(setting.value) ? setting.value : [setting.value];
      setting.value = normalizedValue;

      return setting;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @returns {unknown}
   */
  async getMySettings(userId: string) {
    try {
      const settings = await this.siteSettingsRepository.getMySettings(userId, 'Admin');
      const processedSettings = settings.map((setting) => {
        const normalizedValue = Array.isArray(setting.value) ? setting.value : [setting.value];
        setting.value = normalizedValue;
        return setting;
      });

      return processedSettings;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @returns {*}
   */
  async initMyDefaultSettings(userId: string) {
    try {
      await this.siteSettingsRepository.initMyDefaultSettings(userId, 'Admin');
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
