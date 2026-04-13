import { Module } from '@nestjs/common';
import { SiteSettingsDataModule } from '@app/data-access';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettingsResolver } from './site-settings.resolver';

/**
 * Module that manages site settings functionalities.
 *
 * @export
 * @class SiteSettingsModule
 */
@Module({
  imports: [SiteSettingsDataModule], // Imports necessary data access module
  providers: [SiteSettingsService, SiteSettingsResolver], // Provides the service and resolver
})
export class SiteSettingsModule {}
