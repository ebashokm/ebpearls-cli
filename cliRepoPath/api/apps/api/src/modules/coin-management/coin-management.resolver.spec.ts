import { Test, TestingModule } from '@nestjs/testing';
import { CoinManagementResolver } from './coin-management.resolver';
import { CoinManagementService } from './coin-management.service';

describe('CoinManagementResolver', () => {
  let resolver: CoinManagementResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoinManagementResolver, CoinManagementService],
    }).compile();

    resolver = module.get<CoinManagementResolver>(CoinManagementResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
