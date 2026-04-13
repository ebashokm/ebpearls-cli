import { Test, TestingModule } from '@nestjs/testing';
import { CoinManagementService } from './coin-management.service';

describe('CoinManagementService', () => {
  let service: CoinManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoinManagementService],
    }).compile();

    service = module.get<CoinManagementService>(CoinManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
