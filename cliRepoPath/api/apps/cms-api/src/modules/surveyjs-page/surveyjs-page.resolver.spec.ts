import { Test, TestingModule } from '@nestjs/testing';
import { PageResolver } from '../page/page.resolver';
import { PageService } from '../page/page.service';

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
