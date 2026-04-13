import { Module } from '@nestjs/common';
import { SiteSettingsDataModule } from '@app/data-access';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettingsResolver } from './site-settings.resolver';

/**
 * Site setting module
 *
 * @export
 * @class SiteSettingsModule
 * @typedef {SiteSettingsModule}
 */
@Module({
  imports: [SiteSettingsDataModule],
  providers: [SiteSettingsService, SiteSettingsResolver],
})
export class SiteSettingsModule {}
