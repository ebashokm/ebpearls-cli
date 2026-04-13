import { Module } from '@nestjs/common';
import { CoinManagementService } from './coin-management.service';
import { CoinManagementResolver } from './coin-management.resolver';
import {
  CoinPackageRepository,
  CoinPurchaseRepository,
  User,
  UserSchema,
  UsersRepository,
  CoinPackage,
  CoinPackageSchema,
  CoinPurchase,
  CoinPurchaseSchema,
} from '@app/data-access';
import { S3Service } from '@app/common/services/s3';
import { InappSubscriptionModule } from '@app/inapp-subscription';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from '@app/authentication';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CoinManagementModule
 * @typedef {CoinManagementModule}
 */
@Module({
  imports: [
    AuthenticationModule,
    InappSubscriptionModule.registerAsync({
      useFactory: () => {
        return {
          iapMode: process.env.IAP_MODE || 'sandbox',
          iosSecret: process.env.IN_APP_IOS_SECRET,
          androidClientEmail: process.env.ANDROID_IAP_CLIENT_EMAIL,
          androidPrivateKey: process.env.ANDROID_IAP_PRIVATE_KEY,
        };
      },
    }),
    MongooseModule.forFeature([
      { name: CoinPackage.name, schema: CoinPackageSchema },
      { name: CoinPurchase.name, schema: CoinPurchaseSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [
    CoinManagementResolver,
    CoinManagementService,
    CoinPackageRepository,
    CoinPurchaseRepository,
    UsersRepository,
    S3Service,
  ],

  exports: [CoinManagementService],
})
export class CoinManagementModule {}
