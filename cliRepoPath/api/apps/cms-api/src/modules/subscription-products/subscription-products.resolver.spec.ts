import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionProductsResolver } from './subscription-products.resolver';
import { SubscriptionProductsService } from './subscription-products.service';

describe('SubscriptionProductsResolver', () => {
  let resolver: SubscriptionProductsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionProductsResolver, SubscriptionProductsService],
    }).compile();

    resolver = module.get<SubscriptionProductsResolver>(
      SubscriptionProductsResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
