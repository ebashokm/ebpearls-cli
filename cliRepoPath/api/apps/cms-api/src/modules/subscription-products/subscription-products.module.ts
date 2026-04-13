import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionProductsResolver } from './subscription-products.resolver';
import {
  SubscriptionProduct,
  SubscriptionProductSchema,
  SubscriptionProductRepository,
} from '@app/data-access';
import { SubscriptionProductsService } from './subscription-products.service';
import { StripeService } from '@app/stripe';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SubscriptionProductsModule
 * @typedef {SubscriptionProductsModule}
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SubscriptionProduct.name,
        schema: SubscriptionProductSchema,
      },
    ]),
  ],
  providers: [
    SubscriptionProductsResolver,
    SubscriptionProductsService,
    SubscriptionProductRepository,
    StripeService,
  ],
  exports: [SubscriptionProductsModule],
})
export class SubscriptionProductsModule {}
