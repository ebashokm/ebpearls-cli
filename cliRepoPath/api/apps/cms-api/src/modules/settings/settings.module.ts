import { Settings, SettingsSchema } from '@app/data-access';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { providers } from './providers';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SettingModule
 * @typedef {SettingModule}
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Settings.name, schema: SettingsSchema },
    ]),
  ],
  providers: providers,
})
export class SettingModule {}
