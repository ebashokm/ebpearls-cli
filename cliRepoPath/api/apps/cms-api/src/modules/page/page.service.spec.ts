import { Test, TestingModule } from '@nestjs/testing';
import { CmsPageService } from './cms-page.service';

describe('CmsPageService', () => {
  let service: CmsPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CmsPageService],
    }).compile();

    service = module.get<CmsPageService>(CmsPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
