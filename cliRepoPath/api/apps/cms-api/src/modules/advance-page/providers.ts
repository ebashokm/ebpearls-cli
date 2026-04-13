import { AdvancePageRepository } from '@app/data-access';

import { S3Service } from '@app/common/services/s3';
import { AdvancePageResolver } from './advance-page.resolver';
import { AdvancePageService } from './advance-page.service';

/**
 * ${1:Description placeholder}
 *
 * @type {any[]}
 */
export const providers = [
  AdvancePageResolver,
  AdvancePageService,
  AdvancePageRepository,
  S3Service,
];
