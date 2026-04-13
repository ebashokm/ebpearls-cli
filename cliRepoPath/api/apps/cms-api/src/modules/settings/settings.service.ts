import { SettingsRepository } from '@app/data-access';
import { Injectable } from '@nestjs/common';
import { UpdateSettingsDto } from './dto/input/update.settings.input';
import { SignedUrlMethod } from '@app/common/enum/signed-url.enum';
import { S3Service } from '@app/common/services/s3';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SettingService
 * @typedef {SettingService}
 */
@Injectable()
export class SettingService {
  /**
   * Creates an instance of SettingService.
   *
   * @constructor
   * @param {SettingsRepository} settingsRepository
   */
  constructor(
    private readonly settingsRepository: SettingsRepository,
    private readonly s3service: S3Service,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<any>}
   */
  async getAllSettings() {
    const settings = await this.settingsRepository.find({});
    for (const setting of settings) {
      if (setting?.fieldType === 'image') {
        setting.value = await this.s3service.getPreSignedUrl(setting.value, SignedUrlMethod.GET);
      }
    }
    return settings;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {UpdateSettingsDto} input
   * @returns {Promise<any[]>}
   */
  async updateSettings(input: UpdateSettingsDto) {
    const settingUpdatePromise = [];
    for (const data of input.input) {
      settingUpdatePromise.push(this.settingsRepository.updateById(data._id, data));
    }
    return await Promise.all(settingUpdatePromise);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} slug
   * @returns {Promise<any>}
   */
  async getSettingBySlug(slug: string) {
    const settingBySlug = await this.settingsRepository.findOne({ slug });
    return settingBySlug;
  }
}
