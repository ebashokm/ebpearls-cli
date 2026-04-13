import { Module } from '@nestjs/common';
import { SubscriptionPlanService } from './subscription-plan.service';
import { SubscriptionPlanResolver } from './subscription-plan.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubscriptionPlan,
  SubscriptionPlanRepository,
  SubscriptionPlanSchema,
} from '@app/data-access/subscription-plan';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SubscriptionPlan.name,
        schema: SubscriptionPlanSchema,
      },
    ]),
  ],
  providers: [SubscriptionPlanResolver, SubscriptionPlanService, SubscriptionPlanRepository],
})
export class SubscriptionPlanModule {}
