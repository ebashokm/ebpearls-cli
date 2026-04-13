import { MenuRepository } from '@app/data-access';
import { MenuResolver } from './menu.resolver';
import { MenuService } from './menu.service';
import { S3Service } from '@app/common/services/s3';

/**
 * ${1:Description placeholder}
 *
 * @type {any[]}
 */
export const providers = [MenuResolver, MenuService, MenuRepository, S3Service];
