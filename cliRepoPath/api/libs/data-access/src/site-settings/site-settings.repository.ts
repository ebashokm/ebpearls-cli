import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from './../repository/base.repo';
import { SiteSetting, SiteSettingDocument } from './site-settings.schema';
import { SETTINGS } from './constant/default-site-settings';
import { toMongoId } from '@app/common/helpers/mongo-helper';
import { I18nService } from 'nestjs-i18n';

/**
 * Description placeholder
 *
 * @export
 * @class SiteSettingsRepository
 * @typedef {SiteSettingsRepository}
 * @extends {BaseRepo<SiteSettingDocument>}
 */
@Injectable()
export class SiteSettingsRepository extends BaseRepo<SiteSettingDocument> {
  /**
   * Creates an instance of SiteSettingsRepository.
   *
   * @constructor
   * @param {Model<SiteSettingDocument>} siteSettingsModel
   * @param {I18nService} i18nService
   */
  constructor(
    @InjectModel(SiteSetting.name)
    private readonly siteSettingsModel: Model<SiteSettingDocument>,
    private readonly i18nService: I18nService,
  ) {
    super(siteSettingsModel);
  }

  /**
   * Description placeholder
   *
   * @async
   * @returns {*}
   */
  async initDefaultSettings() {
    await Promise.allSettled(
      SETTINGS.map((setting) =>
        this.siteSettingsModel.findOneAndUpdate(
          { key: setting.key, userId: { $in: [null] } },
          setting,
          { upsert: true },
        ),
      ),
    );
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} key
   * @returns {Promise<SiteSetting>}
   */
  async getSetting(key: string): Promise<SiteSetting> {
    const setting = await this.siteSettingsModel.findOne({ key, userId: { $in: [null] } });
    if (!setting) {
      throw new NotFoundException(this.i18nService.t('site_settings.setting_not_found'));
    }
    return setting;
  }

  /**
   * Description placeholder
   *
   * @async
   * @returns {Promise<SiteSetting[]>}
   */
  async getSettings(): Promise<SiteSetting[]> {
    return await this.siteSettingsModel.find({ userId: { $in: [null] } });
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @returns {*}
   */
  async initMyDefaultSettings(userId: string, userModel: string) {
    for (const setting of SETTINGS) {
      const mySetting = { ...setting, userId: userId, options: null };
      await this.siteSettingsModel.findOneAndUpdate(
        { key: setting.key, userId: userId, userModel },
        mySetting,
        { upsert: true }, // Create new if it doesn't exist
      );
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} key
   * @param {string} userId
   * @returns {Promise<SiteSetting>}
   */
  async getMySetting(key: string, userId: string, userModel: string): Promise<SiteSetting> {
    const setting = await this.siteSettingsModel.findOne({
      key,
      userId: toMongoId(userId),
      userModel,
    });
    if (!setting) {
      throw new NotFoundException(this.i18nService.t('site_settings.setting_not_found'));
    }
    return setting;
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @returns {Promise<SiteSetting[]>}
   */
  async getMySettings(userId: string, userModel: string): Promise<SiteSetting[]> {
    return await this.siteSettingsModel.find({ userId: toMongoId(userId), userModel });
  }

  /**
   * Description placeholder
   *
   * @async
   * @returns {*}
   */
  async updateMySettings(userId: string, userModel: string, settings) {
    for (const setting of settings) {
      const mySetting = { ...setting, userId: userId, options: null };
      await this.siteSettingsModel.findOneAndUpdate(
        { key: setting.key, userId: userId, userModel },
        mySetting,
        { upsert: true }, // Create new if it doesn't exist
      );
    }
  }
}
