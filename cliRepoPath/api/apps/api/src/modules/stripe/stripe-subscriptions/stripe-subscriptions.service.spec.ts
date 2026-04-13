import { Test, TestingModule } from '@nestjs/testing';
import { StripeSubscriptionService } from './stripe-subscriptions.service';
import {
  StripeCustomerRepository,
  StripeSubscriptionRepository,
  SubscriptionProductRepository,
  UsersRepository,
} from '@app/data-access';
import { StripeService } from '@app/stripe';

describe('StripeSubscriptionsService', () => {
  let stripeSubsService: StripeSubscriptionService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        StripeSubscriptionService,
        StripeSubscriptionRepository,
        UsersRepository,
        SubscriptionProductRepository,
        StripeService,
        StripeCustomerRepository,
        {
          provide: UsersRepository,
          useValue: {},
        },
        {
          provide: SubscriptionProductRepository,
          useValue: {},
        },
        {
          provide: StripeService,
          useValue: {},
        },
        {
          provide: StripeSubscriptionRepository,
          useValue: {},
        },
        {
          provide: StripeCustomerRepository,
          useValue: {},
        },
      ],
    }).compile();

    stripeSubsService = moduleRef.get<StripeSubscriptionService>(
      StripeSubscriptionService,
    );
  });

  it('should be defined', () => {
    expect(stripeSubsService).toBeDefined();
  });
});
