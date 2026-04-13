import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { PageResolver } from './page.resolver';

describe('CmsPageResolver', () => {
  let resolver: PageResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageResolver, PageService],
    }).compile();

    resolver = module.get<PageResolver>(PageResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
