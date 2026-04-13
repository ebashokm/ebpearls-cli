import { Test, TestingModule } from '@nestjs/testing';
import { StripeConnectResolver } from './stripe-connect.resolver';
import { StripeConnectService } from './stripe-connect.service';

describe('StripeConnectResolver', () => {
  let resolver: StripeConnectResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StripeConnectResolver, StripeConnectService],
    }).compile();

    resolver = module.get<StripeConnectResolver>(StripeConnectResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
