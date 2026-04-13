import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessResolver } from './business.resolver';
import {
  BusinessRepository,
  User,
  UserSchema,
  UsersRepository,
  Business,
  BusinessSchema,
} from '@app/data-access';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeService } from '@app/stripe';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class BusinessUserModule
 * @typedef {BusinessUserModule}
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Business.name,
        schema: BusinessSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    BusinessResolver,
    BusinessService,
    BusinessRepository,
    UsersRepository,
    StripeService,
  ],
})
export class BusinessModule {}
