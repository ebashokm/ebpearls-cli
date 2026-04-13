import { TaxonomyRepository } from '@app/data-access';
import { TaxonomyResolver } from './taxonomy.resolver';
import { TaxonomyService } from './taxonomy.service';
import { S3Service } from '@app/common/services/s3';

/**
 * ${1:Description placeholder}
 *
 * @type {any[]}
 */
export const providers = [TaxonomyResolver, TaxonomyService, TaxonomyRepository, S3Service];
