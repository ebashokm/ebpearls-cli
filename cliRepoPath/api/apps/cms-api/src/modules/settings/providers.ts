import { SettingsRepository } from '@app/data-access';
import { SettingResolver } from './settings.resolver';
import { SettingService } from './settings.service';
import { S3Service } from '@app/common/services/s3';

/**
 * ${1:Description placeholder}
 *
 * @type {any[]}
 */
export const providers = [SettingResolver, SettingService, SettingsRepository, S3Service];
