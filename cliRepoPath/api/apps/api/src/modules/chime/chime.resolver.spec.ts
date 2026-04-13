import { Test, TestingModule } from '@nestjs/testing';
import { ChimeResolver } from './chime.resolver';
import { ChimeService } from './chime.service';

describe('ChimeResolver', () => {
  let resolver: ChimeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChimeResolver, ChimeService],
    }).compile();

    resolver = module.get<ChimeResolver>(ChimeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
