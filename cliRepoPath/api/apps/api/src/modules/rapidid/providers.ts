import { RapidIdVerificationService } from './rapidid.service';
import { UsersRepository } from '@app/data-access';
import { RapidIdResolver } from './rapidid.resolver';
import { RapidIdService } from '@app/rapidid/index';

export const providers = [
  RapidIdService,
  RapidIdVerificationService,
  UsersRepository,
  RapidIdResolver,
];
