import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationModule } from '@app/authentication';
import { AuthModule } from '../auth/auth.module';
import { FakeApiResolver } from './fake-api.resolver';
import { S3Service } from '@app/common/services/s3';
import { FakeAnimalApiResolver } from './fake-api-animal.resolver';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FakeApiModule
 * @typedef {FakeApiModule}
 */
@Module({
  imports: [JwtModule, AuthModule, AuthenticationModule],
  providers: [FakeApiResolver, FakeAnimalApiResolver, S3Service],
})
export class FakeApiModule {}
