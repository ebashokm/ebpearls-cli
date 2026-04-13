import { Test, TestingModule } from '@nestjs/testing';
import { StripeSubscriptionResolver } from './stripe-subscriptions.resolver';
import { StripeSubscriptionService } from './stripe-subscriptions.service';

describe('StripeSubscriptionsResolver', () => {
  let resolver: StripeSubscriptionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StripeSubscriptionResolver, StripeSubscriptionService],
    }).compile();

    resolver = module.get<StripeSubscriptionResolver>(
      StripeSubscriptionResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
