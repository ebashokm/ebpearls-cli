import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionProductsService } from './subscription-products.service';

describe('SubscriptionProductsService', () => {
  let service: SubscriptionProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionProductsService],
    }).compile();

    service = module.get<SubscriptionProductsService>(
      SubscriptionProductsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
