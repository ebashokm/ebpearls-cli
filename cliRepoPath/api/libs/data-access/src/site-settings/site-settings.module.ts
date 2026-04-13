import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteSetting, SiteSettingSchema } from './site-settings.schema';
import { SiteSettingsRepository } from './site-settings.repository';

/**
 * Description placeholder
 *
 * @export
 * @class SiteSettingsDataModule
 * @typedef {SiteSettingsDataModule}
 * @implements {OnModuleInit}
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: SiteSetting.name, schema: SiteSettingSchema }])],
  providers: [SiteSettingsRepository],
  exports: [SiteSettingsRepository, MongooseModule],
})
export class SiteSettingsDataModule implements OnModuleInit {
  /**
   * Creates an instance of CronModule.
   *
   * @constructor
   * @param {CronService} cronService
   */
  constructor(private readonly siteSettingsRepository: SiteSettingsRepository) {}

  /**
   * Add default site settings to database
   *
   * @async
   * @returns {*}
   */
  async onModuleInit() {
    console.log(`Initialization...`);
    await this.siteSettingsRepository.initDefaultSettings();
  }
}
