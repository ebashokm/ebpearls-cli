import { Test, TestingModule } from '@nestjs/testing';
import { StripeConnectService } from './stripe-connect.service';

describe('BankDetailsService', () => {
  let service: StripeConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StripeConnectService],
    }).compile();

    service = module.get<StripeConnectService>(StripeConnectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
